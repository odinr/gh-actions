import * as core from '@actions/core';
import { Changelog } from 'lerna-changelog';
import { config } from './config';


const main = async () => {
  try {
    const result = await new Changelog(config).createMarkdown();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
};

main();
