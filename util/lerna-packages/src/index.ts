import { join } from 'path';
import { execSync } from 'child_process';

export type Package = {
  name: string,
  version: string,
  tag: string;
  path: string;
}

export type LernaConfig = {
  packages: string[];
}

export const getRootPath = () => String(execSync("git rev-parse --show-toplevel")).trim();

export const getConfig = (path: string = getRootPath()): { packages: string[] } => {
  try {
    return require(`${path}/lerna.json`);
  } catch {
    return { packages: [] }
  }
};

export const getPackages = (
  path: string = getRootPath(),
  { packages }: Pick<LernaConfig, 'packages'> = getConfig(path)
): Array<Package> => {
  return packages.reduce((cur, value) => {
    const raw = String(execSync(`ls -d ${join(path.replace(/(\s)/g, '\\$1'), value)}/`));
    const paths = raw.split('\n').filter(v => !!v);
    const packages = paths.map(path => {
      const { name, version } = require(join(path, 'package.json'));
      return ({
        name,
        version,
        tag: `${name}@${version}`,
        path: path.replace(path, '').replace(/^\//, ''),
      });
    });
    return cur.concat(packages);
  }, [] as Array<Package>);
};

export default getPackages;