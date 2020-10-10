import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

type CommitInfo = { message: string, url: string }

const rules = {
  enhancement: /^feat|^new/i,
  bug: /^fix|^bug/i,
  documentation: /^doc/i,
  internal: /^refactor|^style/i,
  performance: /^perf/i,
  breaking: /BREAKING CHANGE/gmi,
}

const match = (msg: string) => Object.keys(rules).filter(label => !!msg.match(rules[label]));
const extract = (values: string[]) => [...new Set(values.reduce((cur: string[], val: string) => cur.concat(match(val)), []))]

const main = async () => {
  const client = getOctokit(core.getInput('token', { required: true }));
  const [owner, repo] = core.getInput('repository', { required: true }).split('/');
  const pull_number = +core.getInput('pull_number', { required: true });
  const options = { repo, owner, pull_number };
  try {
    const commits: { message: string, url: string, sha: string, labels: string[] }[] = [];
    for await (const response of client.paginate.iterator(client.pulls.listCommits, options)) {
      response.data.forEach(({ sha, commit: { message, url } }) => commits.push({ sha, message, url, labels: match(message) }));
    }
    const labels = [...new Set(commits.reduce((c, v) => c.concat(v.labels), [] as string[]))];
    console.log(commits, labels);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();