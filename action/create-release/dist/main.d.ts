import { getOctokit } from '@actions/github';
export declare type GitHub = ReturnType<typeof getOctokit>;
export declare type Repo = {
    repo: string;
    owner: string;
};
