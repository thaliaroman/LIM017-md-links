#!/usr/bin/env node
const clc = require('cli-color');
const process = require('node:process');

console.log(process.argv);
console.log(clc.red('Text in red'));
console.log(clc.green('hola mundo'));
