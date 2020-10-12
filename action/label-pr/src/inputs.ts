import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

export const token = core.getInput('token', { required: true });
export const client = getOctokit(core.getInput('token', { required: true }));
export const [owner, repo] = core.getInput('repository', { required: true }).split('/');
export const pull_number = +core.getInput('pull_number', { required: true });
export default { client, repo, owner, token, pull_number }