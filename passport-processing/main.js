
const readline = require('readline');
const fs = require('fs');
let passports = [];


const parseLine = (line) => {

    if (!line || line.length === 0) {
        passports.push({});
        return;
    }

    const allRegex = /[a-z]*[0-9]*:[0-9a-z#&+-]*/g;
    const passportSections = line.match(allRegex).filter(Boolean);

    if (passportSections && passportSections.length !== 0) {
        if (passports.length === 0) {
            passports.push({});
        }
        let current = passports[passports.length - 1];
        passportSections.forEach(s => {
            let kvSection = s.split(":");
            current[kvSection[0]] = kvSection[1];
        });

        passports[passports.length - 1] = current;
    }

}

const validatePassport = (passport) => passport.byr !== undefined
    && passport.iyr !== undefined
    && passport.eyr !== undefined
    && passport.hgt !== undefined
    && passport.hcl !== undefined
    && passport.ecl !== undefined
    && passport.pid !== undefined


const validateHgt = (hgt) => {
    const hgtValRegex = /[0-9]*/g
    const hgtVal = hgt.match(hgtValRegex).filter(Boolean)[0];
    const hgtUnit = hgt.replace(hgtVal, '');
    const cmHgtValid = hgtUnit && hgtUnit === 'cm' && hgtVal >= 150 && hgtVal <= 193;
    const inHgtValid = hgtUnit && hgtUnit === 'in' && hgtVal >= 59 && hgtVal <= 76;

    let valid = hgtVal !== ''
        && (hgtUnit === 'in' && inHgtValid
            || hgtUnit === 'cm' && cmHgtValid);

    valid ? null : console.log(`HGT: ${hgt} INVALID`);
    return valid;
}

const validateHcl = (hcl) => {
    const hclRegex = /#[0-9a-f]*/g;
    const hclValMatch = hcl.match(hclRegex);
    if (!hclValMatch || hclValMatch.length === 0) return false;
    const hclVal = hclValMatch.filter(Boolean)[0].replace("#", "");
    const valid = hclVal.length === 6;

    valid ? null : console.log(`HCL: ${hcl} INVALID`);

    if (!valid) console.log(`HCL: ${hcl} ${valid}`);

    return valid;
}

const validateEcl = (ecl) => {
    const eclRegex = /amb|blu|brn|gry|grn|hzl|oth/g;
    if (ecl === undefined) {
        console.log('ECL UNDEFINED')
        return false;
    }
    const eclValsMatch = ecl.match(eclRegex);

    if (!eclValsMatch || eclValsMatch.length === 0) return false;
    const eclVals = eclValsMatch.filter(Boolean);

    let valid = eclVals.length > 0 && eclVals[0] !== '';

    if (!valid) console.log(`PID: ${ecl} ${valid}`);

    return valid;
}

const validatePid = (pid) => {

    // const pidRegex = /^0\d{1,9}$/g;
    const pidRegex = /[0-9]{9}/g;
    const match = pid.match(pidRegex);
    let valid = false;

    if (match) {
        const pidVals = match.filter(Boolean);
        valid = pidVals.length > 0 && pidVals[0] !== '' && pid.length === 9;
    }

    if (!valid) console.log(`PID: ${pid} ${valid}`);
    return valid;
}

const validateByr = (byr) =>
    (byr.toString().length === 4 && byr >= 1920 && byr <= 2002);

const validateIyr = (iyr) =>
    (iyr.length === 4 && iyr >= 2010 && iyr <= 2020);

const validateEyr = (eyr) =>
    (eyr.length === 4 && eyr >= 2020 && eyr <= 2030);


const validatePassportWithRestrictions = (passport) => {

    let preChecks = validatePassport(passport);

    if (!preChecks) return preChecks;

    let valid = validateByr(passport.byr)
        && validateIyr(passport.iyr)
        && validateEyr(passport.eyr)
        && validateHgt(passport.hgt)
        && validateHcl(passport.hcl)
        && validateEcl(passport.ecl)
        && validatePid(passport.pid)

    return valid;
}


const mutatePassports = (path, part) => {

    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', parseLine);
    readInterface.on('error', console.log);
    readInterface.on('close', () => {

        console.log(`** Part ${part} **`)
        let validPassports = part === 1 ? passports.filter(validatePassport) : passports.filter(validatePassportWithRestrictions);
        console.log(`There are ${validPassports.length} valid passports`)
    })
}

// mutatePassports(`${process.cwd()}/passport-processing/passports.dat`, 1);
mutatePassports(`${process.cwd()}/passport-processing/passports.dat`, 2);
