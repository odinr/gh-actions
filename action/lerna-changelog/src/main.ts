import { Changelog } from 'lerna-changelog';
import { config } from './config';
import { packages } from 'util-lerna-packages';

class GG extends Changelog {
  packageFromPath(path: string) {
    const pkg = packages.find(pkg => path.startsWith(pkg.path));
    return pkg?.tag;
  }
}


const main = async () => {
  try {
    // @ts-ignore
    const result = await new GG(config).createMarkdown();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
};

main();
