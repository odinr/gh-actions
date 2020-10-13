export declare const token: string;
export declare const client: {
    [x: string]: any;
} & {
    [x: string]: any;
} & import("@octokit/core").Octokit & import("@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types").RestEndpointMethods & {
    paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
};
export declare const owner: string, repo: string;
export declare const pull_number: number;
declare const _default: {
    client: {
        [x: string]: any;
    } & {
        [x: string]: any;
    } & import("@octokit/core").Octokit & import("@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types").RestEndpointMethods & {
        paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    };
    repo: string;
    owner: string;
    token: string;
    pull_number: number;
};
export default _default;
