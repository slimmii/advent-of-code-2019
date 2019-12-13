import fs from 'fs';
import * as assert from 'assert';
// @ts-ignore
import rl from 'readline-sync';

function paramModes(number: number, params: number) {
    let padded = String(number).padStart(2+params, '0');
    return padded.substr(0, padded.length-2).split('').reverse().map((i) => Boolean(parseInt(i)));
}

function opCode(number: number) {
    return parseInt(number.toString().slice(-2));
}

function * defaultInputGenerator(): IterableIterator<number> {
    while (true) {
        yield parseInt(rl.question(''));
    }
};

class Program {
    private program : number[];
    private ip = 0;
    private opCode? : number = undefined;
    private inputGenerator: IterableIterator<number> = defaultInputGenerator();
    private out : number[] = [];

    constructor(program : number[], inputGenerator?: () => IterableIterator<number>) {
        this.program = program;
        if (inputGenerator) {
            this.inputGenerator = inputGenerator();
        }
    }

    getParamValueWithMode = (paramPos: number, amountOfParams: number) =>{
        let modes = paramModes(this.opCode!, amountOfParams);
        return modes[paramPos] ? this.program[this.ip+paramPos+1] : this.program[this.program[this.ip+paramPos+1]];
    };

    saveValue = (value: number, addr: number) => {
        let ret = this.program[addr];
        this.program[ret] = value;
    };

    add = () => {
        let a = this.getParamValueWithMode(0,2);
        let b = this.getParamValueWithMode(1,2);
        this.saveValue(a + b, this.ip+3);
        this.ip+=4;
    };

    mult = () => {
        let a = this.getParamValueWithMode(0,2);
        let b = this.getParamValueWithMode(1,2 );
        this.saveValue(a * b, this.ip+3);
        this.ip+=4;
    };

    input = () => {
        let answer = this.inputGenerator.next();
        this.saveValue(answer.value, this.ip+1);
        this.ip+=2;
    };

    output = () => {
        let a = this.getParamValueWithMode(0,1);
        console.log(a);
        this.out.push(a);
        this.ip+=2;
    };

    jumpIfTrue = () => {
        let a = this.getParamValueWithMode(0,2);
        let b = this.getParamValueWithMode(1,2);
        if (a !== 0) {
            this.ip = b;
        } else {
            this.ip+=3;
        }
    };

    jumpIfFalse = () => {
        let a = this.getParamValueWithMode(0,2);
        let b = this.getParamValueWithMode(1,2);
        if (a === 0) {
            this.ip = b;
        } else {
            this.ip+=3;
        }
    };

    isLessThan = () => {
        let a = this.getParamValueWithMode(0,2);
        let b = this.getParamValueWithMode(1,2);
        this.saveValue(((a < b) ? 1 : 0), this.ip+3);
        this.ip+=4;
    };

    equals = () => {
        let a = this.getParamValueWithMode(0,2);
        let b = this.getParamValueWithMode(1,2);
        this.saveValue(((a === b) ? 1 : 0), this.ip+3);
        this.ip+=4;
    };

    end = () => {
        this.ip = this.program.length
    };

    isRunning = () => {
        return this.ip < this.program.length;
    };

    run = () => {
        while (this.isRunning()) {
            this.opCode = this.program[this.ip];
            switch (opCode(this.opCode)) {
                case 1: this.add(); break;
                case 2: this.mult(); break;
                case 3: this.input(); break;
                case 4: this.output(); break;
                case 5: this.jumpIfTrue(); break;
                case 6: this.jumpIfFalse(); break;
                case 7: this.isLessThan(); break;
                case 8: this.equals(); break;
                case 99: this.end(); break;
                default: console.log('UNKNOWN OPCODE'); this.end(); break;
            }
        }
        return this.out;
    }

}

assert.deepEqual(new Program([3,9,8,9,10,9,4,9,99,-1,8], function* () { yield 8; }).run(), [1]);
assert.deepEqual(new Program([3,9,8,9,10,9,4,9,99,-1,8], function* () { yield 4; }).run(), [0]);
assert.deepEqual(new Program([3,9,7,9,10,9,4,9,99,-1,8], function* () { yield 4; }).run(), [1]);
assert.deepEqual(new Program([3,9,7,9,10,9,4,9,99,-1,8], function* () { yield 10; }).run(), [0]);
assert.deepEqual(new Program([3,3,1108,-1,8,3,4,3,99], function* () { yield 8; }).run(), [1]);
assert.deepEqual(new Program([3,3,1108,-1,8,3,4,3,99], function* () { yield 4; }).run(), [0]);
assert.deepEqual(new Program([3,3,1107,-1,8,3,4,3,99], function* () { yield 4; }).run(), [1]);
assert.deepEqual(new Program([3,3,1107,-1,8,3,4,3,99], function* () { yield 10; }).run(), [0]);
assert.deepEqual(new Program([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9], function* () { yield 0; }).run(), [0]);
assert.deepEqual(new Program([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9], function* () { yield 5; }).run(), [1]);
assert.deepEqual(new Program([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], function* () { yield 0; }).run(), [0]);
assert.deepEqual(new Program([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], function* () { yield 1; }).run(), [1]);
assert.deepEqual(new Program([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99], function* () { yield 1; }).run(), [999]);
assert.deepEqual(new Program([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99], function* () { yield 8; }).run(), [1000]);
assert.deepEqual(new Program([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99], function* () { yield 9; }).run(), [1001]);

//
// assert.deepEqual(new Program([1,0,0,0,99]).run(), [2,0,0,0,99]);
// assert.deepEqual(new Program([2,3,0,3,99]).run(), [2,3,0,6,99]);
// assert.deepEqual(new Program([1,1,1,4,99,5,6,0,99]).run(), [30,1,1,4,2,5,6,0,99]);
//
const contents = fs.readFileSync('input', 'utf8');
const input : number[] = contents.split(',').map(i => parseInt(i));


 assert.deepEqual(new Program(input, function* () { yield 5; }).run(), [12648139]);

//
// const run = (noun: number, verb: number, program: number[]) : number => {
//     let mem = [...program];
//     mem[1] = noun;
//     mem[2] = verb;
//     return new Program(mem).run()[0];
// }
//
// for (let i=0;i<100;i++) {
//     for (let j=0;j<100;j++) {
//         if (run(i,j, input) === 19690720) {
//             console.log(100*i+j);
//         }
//     }
// }

