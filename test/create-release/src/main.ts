import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github';

import { parse, SemVer } from 'semver';

export type GitHub = ReturnType<typeof getOctokit>;
export type Repo = { repo: string, owner: string };

const getInputs = () => ({
    repo: {
        repo: core.getInput('repo') || context.repo.repo,
        owner: core.getInput('owner') || context.repo.owner,
    },
    token: core.getInput('token', { required: true }),
    sha: core.getInput('sha'),
    version: parse(core.getInput('tag', { required: true }).replace('refs/tags/', '')),
    draft: !!core.getInput('draft') || !!core.getInput('pre'),
});

const getRelease = async (client: GitHub, repo: Repo, version: SemVer) => {
    const per_page = 100;
    for (let page = 1; page < 10; page++) {
        const { data } = await client.repos.listReleases({ ...repo, page, per_page });
        const release = data.find(r => {
            if (!!version.prerelease) {
                const [prerelease] = parse(r.tag_name)?.prerelease || [];
                return prerelease === version.prerelease[0];
            }
            return r.tag_name === version.raw;
        });
        if (release) return release;
        if (data.length < per_page) break;
    }
    return null;
}

async function main() {
    try {
        const { token, repo, version, sha, draft } = getInputs();
        const client = getOctokit(token);

        if (!version) {
            throw Error('could not resolve version for tag');
        }

        const currentRelease = await getRelease(client, repo, version);
        const update_Release = currentRelease && !currentRelease.published_at;

        const isPrerelease = !!version.prerelease;
        const releaseArgs = {
            ...repo,
            name: `${isPrerelease ? 'Prerelease' : 'Release'} ${version.version}`,
            tag_name: version.raw,
            target_commitish: sha,
            prerelease: isPrerelease,
            draft,
        };

        const { data: release } = await (update_Release
            ? client.repos.updateRelease({ ...releaseArgs, release_id: currentRelease!.id })
            : client.repos.createRelease({ ...releaseArgs, })
        );

        core.setOutput('id', release.id);
        core.setOutput('tag', release.tag_name);
        core.setOutput('url', release.html_url);

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();