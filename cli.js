#!/usr/bin/env node
const clc = require('cli-color');
const process = require('node:process');
const fs = require('fs');

const [, , ...args] = process.argv;
const {
  mdLinks,
  totalAndUnique,
} = require('./src/index.js');

const validate = args.includes('--validate');
const stats = args.includes('--stats');

if (args.length === 0) {
  console.log((clc.red('Please enter a path')));
} else if (args.length === 1 && !fs.existsSync(args[0])) {
  console.log(clc.red('PLease enter a correct path'));
} else if (args.length === 1 && !validate && !stats) {
  mdLinks(args[0], { validate: false })
    .then((resolve) => {
      resolve.forEach((res) => console.log(`\n${clc.bgGreen.underline(res.href)} ${clc.green(res.text)}\n${clc.blueBright(res.file)}\n`));
    });
} else if (args.length === 2 && validate && !stats) {
  mdLinks(args[0], { validate: true })
    .then((resolve) => {
      resolve.forEach((res) => console.log(`\n${clc.bgGreen.underline(res.href)} ${clc.green(res.text)}\n${clc.blueBright(res.file)}\n${clc.yellow(res.status)}   ${clc.magenta(res.ok)}\n`));
    });
} else if (args.length === 2 && !validate && stats) {
  mdLinks(args[0], { validate: true })
    .then(() => {
      const totalUnique = totalAndUnique(args[0]);
      console.log(`${clc.blueBright(totalUnique)}`);
    });
} else if (args.length === 3 && validate && stats) {
  mdLinks(args[0], { validate: true })
    .then((resolve) => {
      const totalUnique = totalAndUnique(args[0]);
      let broken = resolve.filter((element) => element.ok !== 'ok').length;
      broken = `Total: ${broken}`;
      console.log(`${clc.cyan(totalUnique)}\n${clc.cyan(broken)}`);
    });
}
