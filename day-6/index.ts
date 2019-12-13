import fs from 'fs';
import * as assert from 'assert';

type SpatialObject = {
    name: string,
    orbits?: SpatialObject
}

const COM : SpatialObject = {
    name: 'COM',
    orbits: undefined
};

function getDistanceBetween(obj: SpatialObject, destination: SpatialObject): number {
    if (obj.orbits && obj.orbits.name !== destination.name) {
        return 1 + getDistanceBetween(obj.orbits, destination);
    } else {
        if (obj.name === destination.name) {
            return 0;
        } else {
            return 1;
        }
    }
}

function createSpaceMap(spaceMap: string[]) {
    let keyValue : {[key: string]: SpatialObject} = {
        'COM': COM
    };

    spaceMap.forEach((it) => {
        const [obj, orbit]: string[] = it.split(')')

        if (!keyValue[obj]) {
            keyValue[obj] = {
                name: obj,
                orbits: undefined
            }
        }
        if (!keyValue[orbit]) {
            keyValue[orbit] = {
                name: orbit,
                orbits: undefined
            }
        }

        keyValue[orbit].orbits = keyValue[obj];

    });

    return keyValue;
}

function getChecksum(spaceMap: string[]) {
    let keyValue = createSpaceMap(spaceMap);

    let counter = 0;
    for (let prop in keyValue) {
        counter += getDistanceBetween(keyValue[prop], COM);
    }
    return counter;
}

function findFirstCommonOrbit(obj: SpatialObject, obj2: SpatialObject) {
    while (obj.orbits) {
        let reference : SpatialObject = obj2;
        while (reference && reference.orbits) {

            if (obj.name === reference.name) {
                return obj;
            }

            reference = reference.orbits;
        }
        obj = obj.orbits;
    }
    return COM;
}

function getDistanceBetweenMeAndSanta(spaceMap: string[]) {
    let keyValue = createSpaceMap(spaceMap);


    let commonOrbit : SpatialObject = findFirstCommonOrbit(keyValue['SAN'], keyValue['YOU']);

    return getDistanceBetween(keyValue['SAN'].orbits!, commonOrbit) + getDistanceBetween(keyValue['YOU'].orbits!, commonOrbit);
}

assert.equal(getChecksum([
    'COM)B',
    'B)C',
    'C)D',
    'D)E',
    'E)F',
    'B)G',
    'G)H',
    'D)I',
    'E)J',
    'J)K',
    'K)L']), 42);



assert.equal(getDistanceBetweenMeAndSanta([
    'COM)B',
    'B)C',
    'C)D',
    'D)E',
    'E)F',
    'B)G',
    'G)H',
    'D)I',
    'E)J',
    'J)K',
    'K)L',
    'K)YOU',
    'I)SAN'
]), 4);


const contents = fs.readFileSync('input', 'utf8');
const input : string[] = contents.split('\n').filter((line) => line !== '');

console.log(getDistanceBetweenMeAndSanta(input));
