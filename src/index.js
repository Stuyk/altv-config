#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const json2toml = require('json2toml');
const args = process.argv.slice(2);

let output = 'server.cfg';

if (args.length <= 0) {
    console.error(new Error(`Failed to specify configuration file. Try 'npx altv-config someFolder/someFile.json'`));
}

if (!fs.existsSync(args[0])) {
    console.error(new Error(`Could not find file at path: ${args[0]}`));
    process.exit(1);
}

// Read output path
if (args[1]) {
    if (!args[1].includes('.')) {
        console.error(new Error(`Output path must have a file name and extension.`));
        process.exit(1);
    }

    output = args[1];
}

function removeNullObjects(data) {
    Object.keys(data).forEach(key => {
        if (data[key] === null) {
            delete data[key];
            return;
        }

        if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
            data[key] = removeNullObjects(data[key]);
            return;
        }
    });

    return data;
}

async function convert() {
    const file = fs.readFileSync(args[0]).toString();

    let json;

    try {
        json = JSON.parse(file);
    } catch (err) {
        console.error(new Error(`Could not parse JSON file. Is JSON file valid? Try linting online.`));
        process.exit(1);
    }

    await removeNullObjects(json);

    const result = json2toml(
        json,
        { indent: 2, newlineAfterSection: true }
    )

    if (fs.existsSync(output)) {
        fs.unlinkSync(output);
    }

    // console.log(parser.parsed);
    fs.writeFileSync(path.normalize(output.replace('.cfg', '.toml')), `${result}`);

}

convert();