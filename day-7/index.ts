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

function *inputGenerator(arr: number[]): IterableIterator<number> {
    for (let i=0;i<arr.length;i++) {
        yield arr[i];
    }
}

class Program {
    private program : number[];
    private ip = 0;
    private opCode? : number = undefined;
    private out : number[] = [];
    private inputGenerator? : IterableIterator<number>;
    private pause = false;
    private name = '';

    constructor(program : number[], name: string) {
        this.program = [...program];
        this.name = name;

    }


    getParamValueWithMode = (paramPos: number, amountOfParams: number) =>{
        let modes = paramModes(this.opCode!, amountOfParams);
        return modes[paramPos] ? this.program[this.ip+paramPos+1] : this.program[this.program[this.ip+paramPos+1]];
    };

    saveValue = (value: number, addr: number) => {
        let ret = this.program[addr];
        if (value === undefined || value === NaN) {
            console.log(this.ip);
            console.log(this.program);
            console.log('writing ' + value + ' to ' + addr);
            console.log('BUG BUG');
            process.exit();
        }
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
        if (this.inputGenerator) {
            let next = this.inputGenerator.next();
            let value = next.value;
            this.saveValue(value, this.ip + 1);
        } else {
            throw new Error('No input provided');
        }
        this.ip+=2;
    };

    output = () => {
        let a = this.getParamValueWithMode(0,1);
        console.log(this.name + ': Output ' + a);
        this.out.push(a);
        this.pause = true;
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
        return (this.ip < this.program.length) && this.pause == false;
    };

    run = (inputParameters: number[]) => {
        if (this.pause) {
            console.log(this.name + " Resuming at " + this.ip + " with params " + inputParameters);
        } else {
            console.log(this.name + " Starting at " + this.ip + " with params " + inputParameters);
        }
        this.pause = false;
        this.out = [];
        this.inputGenerator = inputGenerator(inputParameters);

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
        return {out: this.out.length > 0 ? this.out : inputParameters, finished: this.opCode == 99 };
    }

}

function permFast(xs: number[]): number[][] {
    let ret = [];

    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = permFast(xs.slice(0, i).concat(xs.slice(i + 1)));

        if(!rest.length) {
            ret.push([xs[i]])
        } else {
            for(let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret;
}

function permAndie(xs: number[]): number[][] {

    function countOccurance(num: number, arr: number[]) {
        let count = 0;
        for (let i=0;i<arr.length;i++) {
            if (arr[i] == num) {
                count++;
            }
        }
        return count;
    }

    let ca = [];
    for (let i=0;i<5;i++) {
        for (let j=0;j<5;j++) {
            for (let k=0;k<5;k++) {
                for (let l=0;l<5;l++) {
                    for (let m=0;m<5;m++) {
                        let arr = [i,j,k,l,m];
                        if (countOccurance(0, arr) == 1 && countOccurance(1, arr) == 1
                            && countOccurance(2, arr) == 1 && countOccurance(3, arr) == 1
                            && countOccurance(4, arr) == 1) {
                            ca.push([i,j,k,l,m]);
                        }

                    }
                }
            }
        }
    }

    return ca;

}


const contents = fs.readFileSync('input', 'utf8');
const input : number[] = contents.split(',').map(i => parseInt(i));

// const input : number[] = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
//     -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
//     53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];

let perms = permFast([9,7,8,5,6]);

let signals = [];
for (let i=0;i<perms.length;i++) {
    let sequence = perms[i];
    let lastOutput: number[] = [0];

    let programA = new Program(input, 'ProgramA');
    let programB = new Program(input, 'ProgramB');
    let programC = new Program(input, 'ProgramC');
    let programD = new Program(input, 'ProgramD');
    let programE = new Program(input, 'ProgramE');


    var outputA = programA.run([sequence[0], ...lastOutput]);
    var outputB = programB.run([sequence[1], ...outputA.out]);
    var outputC = programC.run([sequence[2], ...outputB.out]);
    var outputD = programD.run([sequence[3], ...outputC.out]);
    var outputE = programE.run([sequence[4], ...outputD.out]);
    do {
        outputA = programA.run(outputE.out);

        outputB = programB.run(outputA.out);

        outputC = programC.run(outputB.out);

        outputD = programD.run(outputC.out);

        outputE = programE.run(outputD.out);
        lastOutput = outputE.out;
    } while (!outputE.finished);


    signals.push(lastOutput[0]);

}


console.log(Math.max(...signals));

// console.log(signals);

// do {
//     let outputA = new Program(input).run([sequence[0], init]);
//     let outputB = new Program(input).run([sequence[1], ...outputA]);
//     let outputC = new Program(input).run([sequence[2], ...outputB]);
//     let outputD = new Program(input).run([sequence[3], ...outputC]);
//     let outputE = new Program(input).run([sequence[4], ...outputD]);
//     init = outputE[0];
//
//     console.log(init);
//
// } while (init);
//
//
// let permutations = permFast([5,6,7,8,9]);
// let max = 0;
// for (let i=0;i<permutations.length;i++) {
//     let sequence = permutations[i];
//
//     let init : number = 0;
//     do {
//         let outputA = new Program(input).run([sequence[0], init]);
//         let outputB = new Program(input).run([sequence[1], ...outputA]);
//         let outputC = new Program(input).run([sequence[2], ...outputB]);
//         let outputD = new Program(input).run([sequence[3], ...outputC]);
//         let outputE = new Program(input).run([sequence[4], ...outputD]);
//         init = outputE[0];
//     } while (true);
//
// }
// console.log('the max is');
// console.log(max);

