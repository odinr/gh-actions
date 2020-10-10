import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

type CommitInfo = { message: string, url: string, sha: string, labels: string[] }

const rules = {
  enhancement: /^feat|^new/i,
  bug: /^fix|^bug/i,
  documentation: /^doc/i,
  internal: /^refactor|^style/i,
  performance: /^perf/i,
  breaking: /BREAKING CHANGE/gmi,
}

const match = (msg: string) => Object.keys(rules).filter(label => !!msg.match(rules[label]));
const extract = (commits: CommitInfo[]) => {
  const labels = commits.reduce((c, v) => {
    const [_, message] = v.message.match(/^revert.*"(.*)"/igm) || [];
    if (!!message) {
      match(message).forEach(l => {
        const i = c.lastIndexOf(l);
        i > 0 && delete c[i];
      });
      return c;
    }
    return c.concat(v.labels);
  }, [] as string[]);
  console.log(labels.length, commits.length);
  return [...new Set(labels)];
}

const main = async () => {
  const client = getOctokit(core.getInput('token', { required: true }));
  const [owner, repo] = core.getInput('repository', { required: true }).split('/');
  const pull_number = +core.getInput('pull_number', { required: true });
  const options = { repo, owner, pull_number };
  try {
    const commits: CommitInfo[] = [];
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