import fs from 'fs';
import * as assert from 'assert';

const processAdd = (a: number, b: number, ret: number, program : number[]) => {
    return Object.assign([], program, {[ret]: program[a] + program[b]});
};
const processMult = (a: number, b: number, ret: number, program : number[]) => {
    return Object.assign([], program, {[ret]: program[a] * program[b]});
};

const process = (program : number[]) => {
    let programMem = [...program];
    let ip = 0;
    while (ip <= programMem.length) {
        let op = programMem[ip];
        let addr1 = programMem[ip+1];
        let addr2 = programMem[ip+2];
        let addr3 = programMem[ip+3];
        switch (op) {
            case 1: programMem = processAdd(addr1,addr2,addr3, programMem); break;
            case 2: programMem = processMult(addr1, addr2,addr3, programMem); break;
            case 99: ip = programMem.length; break;
        }
        ip += 4;
    }
    return programMem;
};
//
assert.deepEqual(process([1,0,0,0,99]), [2,0,0,0,99]);

assert.deepEqual(process([2,3,0,3,99]), [2,3,0,6,99]);
assert.deepEqual(process([2,4,4,5,99,0]), [2,4,4,5,99,9801]);
assert.deepEqual(process([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99]);

const contents = fs.readFileSync('input', 'utf8');
const input : number[] = contents.split(',').map(i => parseInt(i));


const run = (noun: number, verb: number, program: number[]) : number => {
    let mem = [...program];
    mem[1] = noun;
    mem[2] = verb;
    return process(mem)[0];
}

for (let i=0;i<100;i++) {
    for (let j=0;j<100;j++) {
        if (run(i,j, input) === 19690720) {
            console.log(i);
            console.log(j);
            console.log(100*i+j);
        }
    }
}

