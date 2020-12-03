
const readline = require('readline');
const fs = require('fs');


let passwords = [];


const parseLine = (line) => {

    const limitRegex = /[0-9]*/g;
    const letterRegex = / [a-z]:/g;
    const passwordRegex = /: [a-z]*/g;
    const limit = line.match(limitRegex).filter(Boolean);
    const letter = line.match(letterRegex).join("").replace(" ", "").replace(":", "");
    const phrase = line.match(passwordRegex).join("").replace(" ", "").replace(":", "");

    return {
        lowerLimit: limit[0],
        upperLimit: limit[1],
        letter,
        phrase
    };
}


const mutatePasswords = (path) => {

    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', (line) => {
        passwords.push(parseLine(line))
    });
    readInterface.on('error', console.log);
    readInterface.on('close', () => {

        console.log(`There are ${(passwords.filter(p => {

            let count = countLetter(p.letter, p.phrase);
            return count >= p.lowerLimit && count <= p.upperLimit;

        })).length} Passwords`)

    })
}


const countLetter = (letter, phrase) => Array.from(phrase).reduce((acc, curr) => acc += curr === letter ? 1 : 0, 0);



mutatePasswords(`${process.cwd()}/password-philosophy/passwords.dat`);

