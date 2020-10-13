import { Changelog } from 'lerna-changelog';
import { config, packages } from './config';

class GG extends Changelog {
  packageFromPath(path: string) {
    const pkg = packages.find(pkg => path.startsWith(pkg.path));
    return pkg?.name;
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
