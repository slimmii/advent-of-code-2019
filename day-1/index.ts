import fs from 'fs';
import * as assert from 'assert';

const calculateFuelBase = (mass : number) => Math.floor((mass / 3))-2;
const calculateTotalFuel = (mass : number) : number => {
    const fuel = calculateFuelBase(mass);
    console.log(fuel);
    const additionalFuel = calculateFuelBase(fuel);
    if (additionalFuel > 0) {
        return fuel + calculateTotalFuel(fuel);
    } else {
        return fuel;
    }
};

assert.equal(calculateTotalFuel(14), 2);
assert.equal(calculateTotalFuel(1969), 966);
assert.equal(calculateTotalFuel(100756), 50346);

const contents = fs.readFileSync('input', 'utf8');
const input : number[] = contents.split('\n')
    .map(i => parseInt(i))
    .filter(i => Number.isInteger(i))
    .map(mass => calculateTotalFuel(mass));
input.reduce(((previousValue, currentValue) => previousValue + currentValue));

console.log(input.reduce(((previousValue, currentValue) => previousValue + currentValue)));




