
const readline = require('readline');
const fs = require('fs');

const MAX_ROWS = 128,
    MAX_COLUMNS = 8;
let boardingPasses = [];


const parseLine = (line) => {

    let boardingPassCharArr = Array.from(line);
    const columnSeq = boardingPassCharArr.splice(7);

    return {
        columnSeq,
        rowSeq: boardingPassCharArr
    };
}

const calculateColumn = (boardingPass) => boardingPass.columnSeq.reduce((acc, curr) => {

    if (curr === 'R') {
        return {
            ...acc,
            min: Math.floor((acc.max + acc.min) / 2) + 1
        }
    } else {
        return {
            ...acc,
            max: Math.floor((acc.max + acc.min) / 2)
        }
    }

}, {
    min: 1,
    max: MAX_COLUMNS
}).min - 1 // -1 to bring id back to zero indexed

const calculateRow = (boardingPass) => boardingPass.rowSeq.reduce((acc, curr) => {

    if (curr === 'B') {
        return {
            ...acc,
            min: Math.floor((acc.max + acc.min) / 2) + 1 // aka 128 / 2 + 1 = 65:128
        }
    } else {
        return {
            ...acc,
            max: Math.floor((acc.max + acc.min) / 2) // aka 128 / 2 = 1:64
        }
    }

}, {
    min: 1,
    max: MAX_ROWS
}).min - 1 // -1 to bring id back to zero indexed

const calculateSeatId = (boardingPass) =>
    calculateRow(boardingPass) * 8 + calculateColumn(boardingPass);

const boardingPassSequenceSort = (a, b) => {

    let first = a.rowSeq.join('');
    let second = b.rowSeq.join('');

    if (first > second) {
        return -1;
    } else if (first == second) {

        return a.columnSeq.join('') >= b.columnSeq.join('') ? 1 : -1;

    } else {
        return 1;
    }
}

const findLargestBoardingPass = () => {

    const sortedBoardingPasses = boardingPasses.sort(boardingPassSequenceSort);
    const largestBoardingPass = sortedBoardingPasses[sortedBoardingPasses.length - 1];

    console.log(calculateSeatId(largestBoardingPass));
}


const findMissingBoardingPass = () => boardingPasses
    .sort(boardingPassSequenceSort)
    .map(b => calculateSeatId(b))
    .find((id, index, obj) => id !== index + obj[0]) - 1;


const mutateBoardingPasses = (path, part) => {

    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', (line) => {
        boardingPasses.push(parseLine(line));
    });
    readInterface.on('error', console.log);
    readInterface.on('close', () => {

        if (part === 1) findLargestBoardingPass();
        else console.log(findMissingBoardingPass());

    })
}



mutateBoardingPasses(`${process.cwd()}/binary-boarding/boarding-passes.dat`, 2);

