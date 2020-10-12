import { Changelog } from 'lerna-changelog';
import { load as loadConfig } from 'lerna-changelog/lib/configuration';

import { client, repo, owner } from './inputs';

const main = async () => {
  try {

    const config = loadConfig({
      repo
    });
    const result = new Changelog(config);
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
};

main();
