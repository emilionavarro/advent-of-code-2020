const fs = require('fs');

const getFinalProduct = (expenses) => {

    let solved = false;

    for (let i = 0, len = expenses.length; i < len; i++) {

        var first = expenses[i];

        for (let j = 0; j < len; j++) {

            var second = expenses[j];
            
            for (let v = 0; v < len; v++) {

                var third = expenses[v];

                if ((first + second + third) === 2020) {
                    solved = true;
                    break;
                }
            }

            if (solved) { break; }
        }

        if (solved) { break; }
    }

    return first * second * third;
}


fs.readFile('expenses.json', function read(err, data) {
    if (err) {
        throw err;
    }

    let expenses = JSON.parse(data);
    const finalProduct = getFinalProduct(expenses);

    console.log(finalProduct);
});