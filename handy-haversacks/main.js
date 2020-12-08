

const readline = require('readline');
const fs = require('fs');
const { debug } = require('console');
let bags = [];
// let globalShinyGoldHolderCount = 0;
let bagsToInvestigate = new Set();
let investigatedBags = new Set();

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

        let quantity = r.match(quantityRegex)[0];
        let descriptor = r.replace(`${quantity} `, '');
        let shinyGoldCount = parseInt(descriptor === "shiny gold" ? quantity : 0);

        if (descriptor === "shiny gold") {
            bagsToInvestigate.add(name);
            // globalShinyGoldHolderCount++;
        }

        return {
            quantity,
            descriptor,
            // shinyGoldCount
        };
    });

    let bag = {
        name,
        rules
    }

    return bag;

}


bagsLeftToInvestigateExist = () => {

    let bagsToInvestigateArr = Array.from(bagsToInvestigate.values());

    return bagsToInvestigateArr.length !== investigatedBags.size;

}

getAllBagsContainingX = (containedBag) => {
    return bags.filter(b => b.rules.find(rule => rule.descriptor === containedBag));
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

        // bagRules.forEach(b => {
        //     b.rules.forEach(brule => {
        //         if (shinyGoldHolders.has(brule.descriptor)) {
        //             globalShinyGoldHolderCount++;
        //         }
        //     })
        // })


        while (bagsLeftToInvestigateExist()) {
            Array.from(bagsToInvestigate.values()).forEach(bag => {

                let bagsContainingCurrentBag = getAllBagsContainingX(bag);
                bagsContainingCurrentBag.forEach(b => bagsToInvestigate.add(b.name));

                investigatedBags.add(bag)

                console.log(`bags to investigate: ${bagsToInvestigate.size}`);
                console.log(`investigated bags: ${investigatedBags.size}`);
            })
        }


    })
}


mutateGroups(`${process.cwd()}/handy-haversacks/bagRules.dat`);
