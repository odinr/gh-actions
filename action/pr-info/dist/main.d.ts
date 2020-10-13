export declare const token: string;
export declare const client: {
    [x: string]: any;
} & {
    [x: string]: any;
} & import("@octokit/core").Octokit & import("@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types").RestEndpointMethods & {
    paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
};
export declare const owner: string, repo: string;
export declare const sha: string;
export declare const pull_number: number;
export interface CommitInfo {
    message: string;
    html_url: string;
    sha: string;
    author: string;
    labels: string[];
}
