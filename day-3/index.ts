import fs from 'fs';
import * as assert from 'assert';

type XYCoordinate = {x: number, y: number};

const checkIfContains = (coordinates: XYCoordinate[], coord: XYCoordinate) => {
    for (let i=0; i<coordinates.length ;i++) {
        if (coordinates[i].x == coord.x && coordinates[i].y == coord.y) {
            return true;
        } else {
        }
    }
    return false;
}

const moveY = (coordinates: XYCoordinate[], steps : number, step: number) => {
    let lastCoordinate = coordinates[coordinates.length-1];
    for (let i = 1; i<steps+1 ; i++) {
        coordinates.push({x: lastCoordinate.x, y: lastCoordinate.y + i*step})
    }
    return coordinates;
};

const moveX = (coordinates: XYCoordinate[], steps : number, step: number) => {
    let lastCoordinate = coordinates[coordinates.length-1];
    for (let i = 1; i<steps+1 ; i++) {
        coordinates.push({x: lastCoordinate.x + i*step, y: lastCoordinate.y})
    }
    return coordinates;
};

const turnIntoCoordinates = (directions : string[]) => {
    let coords : XYCoordinate[] = [{x: 0,y: 0}];

    for (let i = 0 ; i < directions.length; i++) {
        let direction : string = directions[i].charAt(0);
        let steps : number = parseInt(directions[i].substr(1));
        if (direction === 'U') {
            coords = moveY(coords, steps, 1);
        }
        if (direction === 'R') {
            coords = moveX(coords, steps, 1);
        }
        if (direction === 'L') {
            coords = moveX(coords, steps, -1);
        }
        if (direction === 'D') {
            coords = moveY(coords, steps, -1);

        }
    }

    return coords;
}


const findClosestCrossedWirePoint = (wire1: string[], wire2: string[]) => {
    const CoordinatesW1 = turnIntoCoordinates(wire1);
    const CoordinatesW2 = turnIntoCoordinates(wire2);
    const intersection = CoordinatesW1.filter((coord : XYCoordinate) => {
        return checkIfContains(CoordinatesW2, coord)
    });


    const haversines = intersection.map((coord : XYCoordinate) => Math.abs(coord.x) + Math.abs(coord.y)).sort((a,b) => a-b);


    return haversines[1];
};

const getWireDistance = (coord: XYCoordinate, wire: XYCoordinate[]) => {
    for (let i=0;i<wire.length;i++) {
        if (wire[i].x === coord.x && wire[i].y === coord.y) {
            return i;
        }
    }
    return 0;
};

const findCheapestCrossedWirePoint = (wire1: string[], wire2: string[]) => {
    const CoordinatesW1 = turnIntoCoordinates(wire1);
    const CoordinatesW2 = turnIntoCoordinates(wire2);
    const intersection = CoordinatesW1.filter((coord: XYCoordinate) => {
        return checkIfContains(CoordinatesW2, coord)
    });


    const distances = intersection.map((coord) => {
        return getWireDistance(coord, CoordinatesW1) + getWireDistance(coord, CoordinatesW2);
    }).sort((a, b) => a-b);
    return distances[1];
}

assert.equal(findClosestCrossedWirePoint(['R75','D30','R83','U83','L12','D49','R71','U7','L72'], ['U62','R66','U55','R34','D71','R55','D58','R83']), 159);
assert.equal(findClosestCrossedWirePoint(['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51'], ['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']), 135);

assert.equal(findCheapestCrossedWirePoint(['R75','D30','R83','U83','L12','D49','R71','U7','L72'], ['U62','R66','U55','R34','D71','R55','D58','R83']), 610);
assert.equal(findCheapestCrossedWirePoint(['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51'], ['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']), 410);

const contents = fs.readFileSync('input', 'utf8').split('\n');
const [w1,w2,...rest] = contents.map((str) => str.split(','));
console.log(findCheapestCrossedWirePoint(w1,w2));
