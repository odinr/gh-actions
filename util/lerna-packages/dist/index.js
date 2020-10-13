"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackages = exports.getConfig = exports.getRootPath = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
exports.getRootPath = () => String(child_process_1.execSync("git rev-parse --show-toplevel")).trim();
exports.getConfig = (path = exports.getRootPath()) => {
    try {
        return require(`${path}/lerna.json`);
    }
    catch (_a) {
        return { packages: [] };
    }
};
exports.getPackages = (path = exports.getRootPath(), { packages } = exports.getConfig(path)) => {
    return packages.reduce((cur, value) => {
        const raw = String(child_process_1.execSync(`ls -d ${path_1.join(path.replace(/(\s)/g, '\\$1'), value)}/`));
        const paths = raw.split('\n').filter(v => !!v);
        const packages = paths.map(path => {
            const { name, version } = require(path_1.join(path, 'package.json'));
            return ({
                name,
                version,
                tag: `${name}@${version}`,
                path: path.replace(path, '').replace(/^\//, ''),
            });
        });
        return cur.concat(packages);
    }, []);
};
exports.default = exports.getPackages;
