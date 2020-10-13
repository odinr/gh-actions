import { join } from 'path';
import { execSync } from 'child_process';

const rootPath = String(execSync("git rev-parse --show-toplevel")).trim();
const lernaConfig = require(`${rootPath}/lerna.json`);

/**
 * @returns [ { path: string, name: string, version: string, tag: string }[]]
 */
export const packages = lernaConfig.packages.reduce((cur, value) => {
  const raw = String(execSync(`ls -d ${join(rootPath.replace(/(\s)/g, '\\$1'), value)}/`));
  const paths = raw.split('\n').filter(v => !!v);
  const packages = paths.map(path => {
    const { name, version } = require(join(path, 'package.json'));
    return ({
      name,
      version,
      tag: `${name}@${version}`,
      path: path.replace(rootPath, '').replace(/^\//, ''),
    });
  });
  return cur.concat(packages);
}, []);