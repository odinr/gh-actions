import * as core from '@actions/core';

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
    process.env.GITHUB_AUTH = core.getInput('token', { required: true });

    const tagFrom = core.getInput('tag_from');
    const tagTo = core.getInput('tag_to');
    // @ts-ignore
    const result = await new GG(config).createMarkdown({ tagFrom, tagTo });
    core.setOutput('markdown', result);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
