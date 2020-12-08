
const readline = require('readline');
const fs = require('fs');
let groupQuestions = [];


const processLine = (line) => {

    if (!line || line.length === 0) {
        groupQuestions.push({
            questions: new Set()
        });
        return;
    }

    if (groupQuestions.length === 0) {
        groupQuestions.push({
            questions: new Set()
        });
    }


    let current = groupQuestions[groupQuestions.length - 1];
    let x = new Set;

    Array.from(line).forEach(q => current.questions.add(q));

}


const mutateGroups = (path, part) => {

    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', processLine);
    readInterface.on('error', console.log);
    readInterface.on('close', () => {

        console.log(`** Part ${part} **`);
        let total = groupQuestions
            .map(b => b.questions.size)
            .reduce((acc, curr) => acc + curr, 0);

        console.log(total);

    })
}

// mutatePassports(`${process.cwd()}/passport-processing/passports.dat`, 1);
mutateGroups(`${process.cwd()}/custom-customs/answers.dat`, 2);
