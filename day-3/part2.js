

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



        let ex1 = getTreeCountBySlope(1, 1)
        let ex2 = getTreeCountBySlope(3, 1)
        let ex3 = getTreeCountBySlope(5, 1)
        let ex4 = getTreeCountBySlope(7, 1)
        let ex5 = getTreeCountBySlope(1, 2)

        console.log(ex1 * ex2 * ex3 * ex4 * ex5);


    })
}



mutatePasswords(`${process.cwd()}/day-3/map.dat`);

