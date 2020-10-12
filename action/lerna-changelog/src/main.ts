import * as core from '@actions/core';
import { Changelog } from 'lerna-changelog';
import { load as loadConfig } from 'lerna-changelog/lib/configuration';

const repo = core.getInput('repository', { required: true });

const main = async () => {
  try {
    const config = loadConfig({
      repo
    });
    const result = await new Changelog(config).createMarkdown();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
};

main();
