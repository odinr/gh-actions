import * as core from '@actions/core';
import { getOctokit } from '@actions/github';
import { getPackages as getLernaPackages, Package } from 'lerna-packages';

export const token = core.getInput('token', { required: true });
export const client = getOctokit(core.getInput('token', { required: true }));
export const [owner, repo] = core.getInput('repository', { required: true }).split('/');
export const sha = core.getInput('sha', { required: true });
export const pull_number = +core.getInput('pull_number', { required: true });

export interface CommitInfo {
  message: string;
  html_url: string;
  sha: string;
  author: string;
  labels: string[];
}

// TODO: make this providable
const rules = {
  enhancement: /^feat|^new/i,
  bug: /^fix|^bug/i,
  documentation: /^doc/i,
  internal: /^refactor|^style/i,
  performance: /^perf/i,
  breaking: /^(?!revert).*BREAKING CHANGE/mi,
}

const matchLabel = (msg: string) => Object.keys(rules).filter(label => !!msg.match(rules[label]));
const extractLabel = (commits: CommitInfo[]) => {
  const labels = commits.reduce((c, v) => c.concat(v.labels), [] as string[]);
  return [...new Set(labels)];
}

const getCommits = async (): Promise<CommitInfo[]> => {
  try {
    const commits: CommitInfo[] = [];
    for await (const response of client.paginate.iterator(client.pulls.listCommits, { repo, owner, pull_number })) {
      for (const commit of response.data) {
        const { sha, html_url, commit: { message, author: { name: author } } } = commit;
        commits.push({ sha, message, html_url, author, labels: matchLabel(message) });
      }
    }
    return commits;
  } catch (error) {
    throw Error(error.message);
  }
}

const getFiles = async (): Promise<string[]> => {
  const { data } = await client.pulls.listFiles({ repo, owner, pull_number });
  return data.map(f => f.filename);
}

const getPackages = async (files?: string[]): Promise<Package[]> => {
  files ??= await getFiles();
  const findPackage = (path: string) => getLernaPackages().find(pkg => path.startsWith(pkg.path));
  return [...new Set(files.map(findPackage).filter(v => !!v) as Array<Package>)];
};

const main = async () => {
  try {
    const files = await getFiles();
    const commits = await getCommits();
    const pushedCommits = commits.slice(commits.findIndex(commit => commit.sha === sha) + 1);

    core.setOutput('files', files);
    core.setOutput('commits', commits);
    core.setOutput('labels', extractLabel(commits));
    core.setOutput('packages', getPackages(files));

    core.setOutput('pushed_commits', pushedCommits);
    core.setOutput('pushed_labels', extractLabel(pushedCommits));

  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
