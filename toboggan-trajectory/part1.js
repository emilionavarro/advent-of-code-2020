

//right 3, down 1

const readline = require('readline');
const fs = require('fs');


let map = [];


const parseLine = (line) => Array.from(line);

const getTreeCountBySlope = (xStep, yStep) => {
    let yIndex = 0;
    let xIndex = 0; //loop back to 0 comme 10
    let treeCount = 0;
    let lineLength = map[0].length;

    while (true) {

        yIndex += yStep;
        xIndex += xStep;

        if (xIndex >= lineLength) {
            xIndex = (xIndex % lineLength);
        }

        if (!map[yIndex] || !map[yIndex][xIndex]) {
            break;
        }
        treeCount += map[yIndex][xIndex] === "#" ? 1 : 0;
    }

    return treeCount;
}

const mutatePasswords = (path) => {

    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', (line) => {
        map.push(parseLine(line))
    });
    readInterface.on('error', console.log);
    readInterface.on('close', () => {



        let ex2 = getTreeCountBySlope(3, 1)

        console.log(ex2);
    })
}



mutatePasswords(`${process.cwd()}/day-3/map.dat`);

