import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

const main = async () => {
  console.log(+core.getInput('pull_number', { required: true }));

  const client = getOctokit(core.getInput('token', { required: true }));
  const commits = await client.pulls.listCommits({
    repo: core.getInput('repo', { required: true }),
    owner: core.getInput('owner', { required: true }),
    pull_number: +core.getInput('pull_number', { required: true }),
  });
  console.log(commits);
};

main();