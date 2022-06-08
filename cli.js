#!/usr/bin/env node
const clc = require('cli-color');
const process = require('node:process');
const emojis = require('node-emoji');
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
      resolve.forEach((res) => console.log(`${clc.cyanBright(res.href)}  ${clc.magentaBright(res.text)} ${clc.blueBright(res.file)}`));
    });
} else if (args.length === 2 && validate && !stats) {
  mdLinks(args[0], { validate: true })
    .then((resolve) => {
      resolve.forEach((res) => console.log(`${clc.cyanBright(res.href)}  ${clc.magentaBright(res.text)}  ${clc.blueBright(res.file)}  ${clc.greenBright(res.status)}  ${clc.redBright(res.ok)}`));
    });
} else if (args.length === 2 && !validate && stats) {
  mdLinks(args[0], { validate: true })
    .then(() => {
      const totalUnique = totalAndUnique(args[0]);
      console.log(totalUnique);
    });
} else if (args.length === 3 && validate && stats) {
  mdLinks(args[0], { validate: true })
    .then((resolve) => {
      const totalUnique = totalAndUnique(args[0]);
      const broken = resolve.filter((element) => element.ok !== 'ok').length;
      console.log(`${totalUnique}\nBroken:${broken}`);
    });
}
