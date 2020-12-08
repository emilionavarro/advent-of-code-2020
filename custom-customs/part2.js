
const readline = require('readline');
const fs = require('fs');
let groupQuestions = [];


const processLine = (line) => {

    if (!line || line.length === 0) {
        groupQuestions.push({
            questions: {},
            groupSize: 0
        });
        return;
    }

    if (groupQuestions.length === 0) {
        groupQuestions.push({
            questions: {},
            groupSize: 0
        });
    }


    let current = groupQuestions[groupQuestions.length - 1];
    current.groupSize++;

    Array.from(line).forEach(q => {

        if (current.questions[q]){
            current.questions[q]++;
        } else {
            current.questions[q] = 1
        }

    });

    console.log()

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
            .map(group => {
                let allFullyAnsweredQuestions = Object.values(group.questions).filter(q => group.groupSize === q);
                return allFullyAnsweredQuestions.length;
            })
            .reduce((acc, curr) => acc + curr, 0);

        console.log(total);

    })
}

// mutatePassports(`${process.cwd()}/passport-processing/passports.dat`, 1);
mutateGroups(`${process.cwd()}/custom-customs/answers.dat`, 2);
