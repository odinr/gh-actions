"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const rootPath = String(child_process_1.execSync("git rev-parse --show-toplevel")).trim();
const lernaConfig = require(`${rootPath}/lerna.json`);
const ff = lernaConfig.packages.reduce((cur, value) => {
    const raw = String(child_process_1.execSync(`ls -d ${path_1.join(rootPath.replace(/(\s)/g, '\\$1'), value)}/`));
    const packages = raw.split('\n').map(a => a.replace(rootPath + '/', '')).filter(v => !!v);
    return cur.concat(packages);
}, []);
console.log(lernaConfig, ff);
