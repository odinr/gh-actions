"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const semver_1 = require("semver");
const getInputs = () => ({
    repo: {
        repo: core.getInput('repo') || github_1.context.repo.repo,
        owner: core.getInput('owner') || github_1.context.repo.owner,
    },
    token: core.getInput('token', { required: true }),
    sha: core.getInput('sha'),
    version: semver_1.parse(core.getInput('tag', { required: true }).replace('refs/tags/', '')),
    draft: !!core.getInput('draft') || !!core.getInput('pre'),
});
const getRelease = (client, repo, version) => __awaiter(void 0, void 0, void 0, function* () {
    const per_page = 100;
    for (let page = 1; page < 10; page++) {
        const { data } = yield client.repos.listReleases(Object.assign(Object.assign({}, repo), { page, per_page }));
        const release = data.find(r => {
            var _a;
            if (!!version.prerelease) {
                const [prerelease] = ((_a = semver_1.parse(r.tag_name)) === null || _a === void 0 ? void 0 : _a.prerelease) || [];
                return prerelease === version.prerelease[0];
            }
            return r.tag_name === version.raw;
        });
        if (release)
            return release;
        if (data.length < per_page)
            break;
    }
    return null;
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, repo, version, sha, draft } = getInputs();
            const client = github_1.getOctokit(token);
            if (!version) {
                throw Error('could not resolve version for tag');
            }
            const currentRelease = yield getRelease(client, repo, version);
            const update_Release = currentRelease && !currentRelease.published_at;
            const isPrerelease = !!version.prerelease;
            const releaseArgs = Object.assign(Object.assign({}, repo), { name: `${isPrerelease ? 'Prerelease' : 'Release'} ${version.version}`, tag_name: version.raw, target_commitish: sha, prerelease: isPrerelease, draft });
            const { data: release } = yield (update_Release
                ? client.repos.updateRelease(Object.assign(Object.assign({}, releaseArgs), { release_id: currentRelease.id }))
                : client.repos.createRelease(Object.assign({}, releaseArgs)));
            core.setOutput('id', release.id);
            core.setOutput('tag', release.tag_name);
            core.setOutput('url', release.html_url);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
main();
