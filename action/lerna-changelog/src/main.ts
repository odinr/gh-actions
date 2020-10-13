import { Changelog } from 'lerna-changelog';
import { config, packages } from './config';

class GG extends Changelog {
  packageFromPath(path: string) {
    const parts = path.split("/");
    const ff = packages.find(pkg => path.startsWith(pkg));
    if (ff) {
      return parts[1];
    }
    // if(path.startsWith())
    // if (parts[0] !== "packages" || parts.length < 3) {
    //   return "";
    // }
    // if (parts.length >= 4 && parts[1][0] === "@") {
    //   return `${parts[1]}/${parts[2]}`;
    // }
    // return parts[1];
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
