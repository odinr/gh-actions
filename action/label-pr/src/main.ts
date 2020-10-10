import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

const rules = {
  enhancement: /^feat|^new/i,
  bug: /^fix|^bug/i,
  documentation: /^doc/i,
  internal: /^refactor|^style/i,
  performance: /^perf/i,
  breaking: /BREAKING CHANGE/gmi,
}

const gg = (msg: string) => Object.keys(rules).filter(label => !!msg.match(rules[label]));

const main = async () => {
  const client = getOctokit(core.getInput('token', { required: true }));
  const [owner, repo] = core.getInput('repository', { required: true }).split('/');
  const pull_number = +core.getInput('pull_number', { required: true });
  const options = { repo, owner, pull_number };
  console.log(options);
  try {
    const commits: string[] = [];
    for await (const response of client.paginate.iterator(client.pulls.listCommits, options)) {
      response.data.forEach(commit => commits.push(commit.commit.message));
    }
    console.log(commits);
    console.log(new Set(...[...commits.map(gg)]));
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();