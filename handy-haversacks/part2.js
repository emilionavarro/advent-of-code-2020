

const readline = require('readline');
const fs = require('fs');
let bags = [];


const processLine = (line) => {

    let bagDescriptors = line
        .split(' bags')
        .join('')
        .split(' bag')
        .join('')
        .split(" contain ");

    let name = bagDescriptors[0];
    let rules = bagDescriptors[1].split(', ')
        .map(b => b
            .replace('.', '')
        );

    let quantityRegex = /[0-9]*/g;
    rules = rules.map(r => {

        let quantity = parseInt(r.match(quantityRegex)[0]);
        let descriptor = r.replace(`${quantity} `, '');

        return {
            quantity,
            descriptor
        };
    });

    rules = rules.filter(r => r.descriptor !== 'no other');

    let bag = {
        name,
        rules
    }

    return bag;

}

const count = (bag, quantity) => {

    let bagDetails = bags.find(b => b.name === bag);

    if (bagDetails.rules.length === 0) {
        return quantity;
    } else {
         let childCounts = bagDetails.rules
            .map(r => count(r.descriptor, r.quantity))
            .reduce((acc, curr) => acc + curr, 0)
        return quantity + (quantity * childCounts);
    }
}

const mutateGroups = (path) => {

    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', (line) => bags.push(processLine(line)));
    readInterface.on('error', console.log);
    readInterface.on('close', () => {

        console.log(`True count: ${count("shiny gold", 1) - 1}`);

    })
}


mutateGroups(`${process.cwd()}/handy-haversacks/bagRules.dat`);
