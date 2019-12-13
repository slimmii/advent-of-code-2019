import fs from 'fs';
import * as assert from 'assert';
// You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.
//
// However, they do remember a few key facts about the password:
//
//     It is a six-digit number.
//     The value is within the range given in your puzzle input.
//     Two adjacent digits are the same (like 22 in 122345).
// Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
// Other than the range rule, the following are true:
//
// 111111 meets these criteria (double 11, never decreases).
// 223450 does not meet these criteria (decreasing pair of digits 50).
// 123789 does not meet these criteria (no double).
// How many different passwords within the range given in your puzzle input meet these criteria?
//
//     Your puzzle input is 137683-596253.

const acceptable = [];

const isAcceptable = (i : number) => {
    let numStr = i.toString();
    let prevDigit = parseInt(numStr.charAt(0));
    let isIncreasing = true;
    let conseqPresent = false;
    let conseqDigitsInARow = 1;
    for (let c = 1; c < numStr.length ; c++) {
        let digit = parseInt(numStr.charAt(c));
        if (digit >= prevDigit) {
            if (prevDigit == digit) {
                conseqDigitsInARow++;
            } else {
                if (conseqDigitsInARow == 2) {
                    conseqPresent = true;
                }
                conseqDigitsInARow=1;
            }
            prevDigit = parseInt(numStr.charAt(c));
        } else {
            isIncreasing = false;
        }
    }
    if (conseqDigitsInARow == 2) {
        conseqPresent = true;
    }
    if (isIncreasing && conseqPresent) {
        return true;
    } else {
        return false;
    }
}

for (let i = 137683; i < 596253; i++) {

    if (isAcceptable(i)) {
        acceptable.push(i);
    }
}

console.log(acceptable.length);


assert.equal(isAcceptable(112233), true);
assert.equal(isAcceptable(123444), false);
assert.equal(isAcceptable(111122), true);
