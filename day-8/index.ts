import fs from 'fs';
import * as assert from 'assert';

let width = 25;
let height = 6;
const contents = fs.readFileSync('input', 'utf8');

const count = (layer: string, char: string) => {
    return (layer.match(new RegExp(char + "{1}","g"))  || []).length;
};

let layers = contents.match(new RegExp(".{1," + width*height + "}","g"));

let layer = layers!
    .map((layer) => {
        return { zeroes: count(layer, "0"), layer };
    })
    .sort((l1,l2) => { return l1.zeroes-l2.zeroes; })
    [0].layer;

console.log(count(layer,'1') * count(layer,'2'));

let pixels = [];
for (let x=0;x<width*height;x++) {
    let i = 0;
    do {
        let pixel = layers![i].charAt(x);
        if (pixel === '0' || pixel === '1') {
            pixels.push(pixel);
            break;
        };
        i++;
    } while (true)
}

pixels.join('').match(new RegExp(".{1," + width + "}","g"))!.forEach((line) => { console.log(line
    .replace(new RegExp('0','g'), " ")
    .replace(new RegExp('1','g'), "█")
); });
