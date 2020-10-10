import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

const main = async () => {
  const client = getOctokit(core.getInput('token', { required: true }));
  const [repo, owner] = core.getInput('repository', { required: true }).split('/');
  const pull_number = +core.getInput('pull_number', { required: true });
  try {
    const commits = await client.pulls.listCommits({ repo, owner, pull_number });
    console.log(commits);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();