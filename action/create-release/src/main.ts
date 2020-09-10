import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github';

import { parse, SemVer } from 'semver';

export type GitHub = ReturnType<typeof getOctokit>;
export type Repo = { repo: string, owner: string };

/**
 * action inputs
 */
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

/**
 * Get release from repo
 * will test the last 1000 tags for a previous tag.
 */
const getRelease = async (client: GitHub, repo: Repo, version: SemVer) => {
    const per_page = 100;
    const prefix = version.raw.replace(version.version, '');

    for (let page = 1; page < 10; page++) {
        const { data } = await client.repos.listReleases({ ...repo, page, per_page });

        // search for a matching tag
        const release = data.find(r => {

            // the version is not at prerelease, tags must match exact
            if (!version.prerelease) {
                return r.tag_name === version.raw;
            }

            // check if the tag has same prefix as provided tag
            if(prefix && !r.tag_name.startsWith(prefix)){
                return false;
            }

            // match prerelease id with tag
            const [prerelease] = parse(r.tag_name)?.prerelease || [];
            return prerelease === version.prerelease[0];
        });

        // return if found
        if (release) return release;

        // quit if dataset is less than pagination
        if (data.length < per_page) break;
    }
    return null;
}

async function main() {
    try {
        const { token, repo, version, sha, draft } = getInputs();
        const client = getOctokit(token);

        if (!version) {
            throw Error('could not resolve version for tag, only semver supported');
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
        core.setOutput('sha', release.target_commitish);
        core.setOutput('url', release.html_url);
        core.setOutput('update', update_Release);

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();