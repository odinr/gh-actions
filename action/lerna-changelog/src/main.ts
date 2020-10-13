import * as core from '@actions/core';
import { Changelog } from 'lerna-changelog';
import { load as loadConfig } from 'lerna-changelog/lib/configuration';

const repo = core.getInput('repository', { required: true });
const nextVersion = "v.1.2.3";

const ignoreCommitters = [
  "dependabot-bot",
  "dependabot[bot]",
  "greenkeeperio-bot",
  "greenkeeper[bot]",
  "renovate-bot",
  "renovate[bot]",
];

const labels = {
  breaking: ":boom: Breaking Change",
  enhancement: ":rocket: Enhancement",
  bug: ":bug: Bug Fix",
  documentation: ":memo: Documentation",
  internal: ":house: Internal",
};

const { exec } = require("child_process");

const run = (cmd: string) => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if(error){
      reject(error);
    }
    if(stderr){
      reject(Error(stderr));
    }
    resolve(stdout);
  });
}); 


const main = async () => {
  try {
    const config = {
      repo,
      labels,
      nextVersion,
      ignoreCommitters,
      rootPath: await run("git rev-parse --show-toplevel")
    };
    const result = await new Changelog(config).createMarkdown();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
};

main();
