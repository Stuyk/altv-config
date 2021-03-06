#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
let output = 'server.cfg';

if (args.length <= 0) {
    console.error(new Error(`Failed to specify configuration file. Try 'npx altv-config someFolder/someFile.json'`))
}

if (!fs.existsSync(args[0])) {
    console.error(new Error(`Could not find file at path: ${args[0]}`))
    process.exit(1);
}

// Read output path
if (args[1]) {
    if (!args[1].includes('.')) {
        console.error(new Error(`Output path must have a file name and extension.`))
        process.exit(1);
    }

    output = args[1];
}

const file = fs.readFileSync(args[0]).toString();

let json;

try {
    json = JSON.parse(file);
} catch (err) {
    console.error(new Error(`Could not parse JSON file. Is JSON file valid? Try linting online.`))
    process.exit(1);
}

let dataToWrite = [];

Object.keys(json).forEach(key => {
    const value = json[key];
    if (!value) {
        return;
    }

    if (typeof value === 'boolean') {
        dataToWrite.push(`${key}: ${value}`)
        return;
    }

    if (typeof value === 'string') {
        dataToWrite.push(`${key}: "${value}"`)
        return;
    }

    if (typeof value === 'number') {
        dataToWrite.push(`${key}: ${value}`)
        return;
    }

    if (typeof value === 'object' && Array.isArray(value)) {
        dataToWrite.push(`${key}: ${JSON.stringify(value)}`)
        return;
    }

    if (typeof value === 'object') {
        // Should generate similar to:
        // voice: {
        //     bitrate: 64000,
        //     externalSecret: "secret123",
        // }
        dataToWrite.push(`${key}: {`)
        Object.keys(value).forEach(valueKey => {
            const resultValue = value[valueKey];
            if (!resultValue) {
                return;
            }

            if (typeof resultValue === 'string') {
                dataToWrite.push(`  ${valueKey}: "${resultValue}"`)
                return;
            }

            if (typeof resultValue === 'number') {
                dataToWrite.push(`  ${valueKey}: ${resultValue}`)
                return;
            }
        });
        dataToWrite.push(`}`)
        return;
    }
});

if (fs.existsSync(output)) {
    fs.unlinkSync(output);
}

for (let i = 0; i < dataToWrite.length; i++) {
    fs.appendFileSync(path.normalize(output), `${dataToWrite[i]}\r\n`);
}