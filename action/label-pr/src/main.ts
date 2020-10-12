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
  const labels = commits.reduce((c, v) => {
    const [_, message] = v.message.match(/(?:^revert[:]?) \"(.*)\"/mi) || [];
    _ && console.log(_, message);
    if (!!message) {
      match(message).forEach(l => {
        const i = c.lastIndexOf(l);
        console.log(message, c[i]);
        i > 0 && delete c[i];
      });
      return c;
    }
    return c.concat(v.labels);
  }, [] as string[]);
  console.log(labels, commits.map(v => v.labels));
  return [...new Set(labels)];
}

const main = async () => {
  const client = getOctokit(core.getInput('token', { required: true }));
  const [owner, repo] = core.getInput('repository', { required: true }).split('/');
  const pull_number = +core.getInput('pull_number', { required: true });
  const update = !!core.getInput('update');
  const before = core.getInput('before');
  console.log(update, before, context);
  try {
    const commits: CommitInfo[] = [];
    fetch:
    for await (const response of client.paginate.iterator(client.pulls.listCommits, { repo, owner, pull_number })) {
      for(const commit of response.data){
        const { sha, commit: { message, url } } = commit;
        console.log(sha);
        if(update && sha === before){
          break fetch;
        }
        commits.push({ sha, message, url, labels: match(message) });
      }
    }
    const labels = extract(commits);
    console.log(labels);
  } catch (error) {
    core.setFailed(error.message);
  }
};
// console.log("commits:", core.getInput('commits'));
// @ts-ignore
// console.log("event:", GITHUB_CONTEXT);abcd
main();
