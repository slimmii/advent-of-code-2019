import fs from 'fs';
import * as assert from 'assert';

const process = (mass : number) => {
    return Math.floor((mass / 3))-2;
}

assert.equal(process(12), 2);
assert.equal(process(14), 2);
assert.equal(process(1969), 654);
assert.equal(process(100756), 33583);

const contents = fs.readFileSync('input', 'utf8');
const input : number[] = contents.split('\n')
                         .map(i => parseInt(i))
                         .filter(i => Number.isInteger(i))
                         .map(mass => process(mass));
input.reduce(((previousValue, currentValue) => previousValue + currentValue));

console.log(input.reduce(((previousValue, currentValue) => previousValue + currentValue)));




