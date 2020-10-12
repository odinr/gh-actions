import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

type CommitInfo = { message: string, url: string, sha: string, labels: string[] }
const gg = 'opened'// 'reopened';
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
  const labels = commits.reduce((c, v) => c.concat(v.labels), [] as string[]);
  return [...new Set(labels)];
}

const getCommits = async (): Promise<CommitInfo[]> => {
  const client = getOctokit(core.getInput('token', { required: true }));
  const [owner, repo] = core.getInput('repository', { required: true }).split('/');
  const pull_number = +core.getInput('pull_number', { required: true });
  try {
    const commits: CommitInfo[] = [];
    for await (const response of client.paginate.iterator(client.pulls.listCommits, { repo, owner, pull_number })) {
      for (const commit of response.data) {
        const { sha, commit: { message, url } } = commit;
        commits.push({ sha, message, url, labels: match(message) });
      }
    }
    return commits;
  } catch (error) {
    throw Error(error.message);
  }
}

const main = async () => {
  const update = !!core.getInput('update');
  const before = core.getInput('before');
  try {
    const commits = await getCommits();
    const labels = extract(
      update ? commits.slice(commits.findIndex(commit => commit.sha === before) + 1) : commits
    );
    console.log(commits, labels);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
