#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2);
let output = "server.cfg";

if (args.length <= 0) {
  console.error(
    new Error(
      `Failed to specify configuration file. Try 'npx altv-config someFolder/someFile.json'`
    )
  );
}

if (!fs.existsSync(args[0])) {
  console.error(new Error(`Could not find file at path: ${args[0]}`));
  process.exit(1);
}

// Read output path
if (args[1]) {
  if (!args[1].includes(".")) {
    console.error(
      new Error(`Output path must have a file name and extension.`)
    );
    process.exit(1);
  }

  output = args[1];
}

const file = fs.readFileSync(args[0]).toString();

let json;

try {
  json = JSON.parse(file);
} catch (err) {
  console.error(
    new Error(
      `Could not parse JSON file. Is JSON file valid? Try linting online.`
    )
  );
  process.exit(1);
}

let dataToWrite = [];

class Parser {
  constructor(json) {
    this.parsed = this.parse(json, 0);
  }

  parse(json, tab) {
    let data = "";
    const tabs = (() => "\t".repeat(tab))();
    Object.keys(json).forEach((key) => {
      const value = json[key];

      if (value === null || value === undefined) return;

      if (typeof value === "boolean") {
        data += `${tabs}${key}: ${value}\n`;
        return;
      }

      if (typeof value === "string") {
        data += `${tabs}${key}: "${value}"\n`;
        return;
      }

      if (typeof value === "number") {
        data += `${tabs}${key}: ${value}\n`;
        return;
      }

      if (typeof value === "object" && Array.isArray(value)) {
        data += `${tabs}${key}: [\n`;
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          data += `${tabs}\t"${element}"\n`;
        }
        data += `${tabs}]\n`;
        return;
      }

      if (typeof value === "object") {
        data += `${tabs}${key}: {\n`;
        data += `${this.parse(value, tab + 1)}`;
        data += `${tabs}}\n`;
        return;
      }
    });

    return data;
  }
}

const parser = new Parser(json);

if (fs.existsSync(output)) {
  fs.unlinkSync(output);
}

fs.appendFileSync(path.normalize(output), `${parser.parsed}`);
