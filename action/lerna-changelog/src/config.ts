import * as core from '@actions/core';
import { execSync } from 'child_process';

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

export const config = {
  repo,
  rootPath,
  labels,
  nextVersion,
  ignoreCommitters,
};

export default config;