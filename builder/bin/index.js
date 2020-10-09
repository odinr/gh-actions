#! /usr/bin/env node

const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const {default: resolve} = require('@rollup/plugin-node-resolve');
const commonJs = require('@rollup/plugin-commonjs');
const { join } = require('path');

const rootDir = process.cwd();

console.log(join(rootDir, 'node_modules'));

const inputOptions = {
    input: join(rootDir, '/src/main.ts'),
    plugins: [
        resolve(),
        // resolve({rootDir: join(rootDir, 'node_modules'), browser: false}),
        // resolve({rootDir: join(process.cwd(), '../../../..')}),
        commonJs(),
        typescript(), 
    ],
}
const outputOptions = {
    dir: join(rootDir, '/dist'),
    format: 'cjs',
}

rollup.rollup(inputOptions).then(bundle => bundle.write(outputOptions));