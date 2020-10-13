import * as core from '@actions/core';
import { execSync } from 'child_process';
import { join } from 'path';

interface LernaConfig {
  packages: string[];
}

// === inputs === //
const repo = core.getInput('repository', { required: true });
const nextVersion = core.getInput('next_version') || '';

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

const rootPath = String(execSync("git rev-parse --show-toplevel")).trim();
const lernaConfig = require(`${rootPath}/lerna.json`) as LernaConfig;

export const packages = lernaConfig.packages.reduce((cur, value) => {
  const raw = String(execSync(`ls -d ${join(rootPath.replace(/(\s)/g, '\\$1'), value)}/`));
  const paths = raw.split('\n').filter(v => !!v);
  const packages = paths.map(path => ({
    path: path.replace(rootPath, '').replace(/^\//, ''),
    name: require(join(path, 'package.json')).name
  }));
  return cur.concat(packages);
}, [] as { path: string, name: string }[]);

export const config = {
  repo,
  rootPath,
  labels,
  nextVersion,
  ignoreCommitters,
};

export default config;