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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pull_number = exports.sha = exports.repo = exports.owner = exports.client = exports.token = void 0;
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const lerna_packages_1 = require("lerna-packages");
exports.token = core.getInput('token', { required: true });
exports.client = github_1.getOctokit(core.getInput('token', { required: true }));
_a = core.getInput('repository', { required: true }).split('/'), exports.owner = _a[0], exports.repo = _a[1];
exports.sha = core.getInput('sha');
exports.pull_number = +core.getInput('pull_number', { required: true });
const rules = {
    enhancement: /^feat|^new/i,
    bug: /^fix|^bug/i,
    documentation: /^doc/i,
    internal: /^refactor|^style/i,
    performance: /^perf/i,
    breaking: /^(?!revert).*BREAKING CHANGE/mi,
};
const matchLabel = (msg) => Object.keys(rules).filter(label => !!msg.match(rules[label]));
const extractLabel = (commits) => {
    const labels = commits.reduce((c, v) => c.concat(v.labels), []);
    return [...new Set(labels)];
};
const getCommits = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _b;
    try {
        const commits = [];
        try {
            for (var _c = __asyncValues(exports.client.paginate.iterator(exports.client.pulls.listCommits, { repo: exports.repo, owner: exports.owner, pull_number: exports.pull_number })), _d; _d = yield _c.next(), !_d.done;) {
                const response = _d.value;
                for (const commit of response.data) {
                    const { sha, html_url, commit: { message, author: { name: author } } } = commit;
                    commits.push({ sha, message, html_url, author, labels: matchLabel(message) });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) yield _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return commits;
    }
    catch (error) {
        throw Error(error.message);
    }
});
const getFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield exports.client.pulls.listFiles({ repo: exports.repo, owner: exports.owner, pull_number: exports.pull_number });
    return data.map(f => f.filename);
});
const affectedPackages = (files) => __awaiter(void 0, void 0, void 0, function* () {
    files !== null && files !== void 0 ? files : (files = yield getFiles());
    const findPackage = (path) => lerna_packages_1.getPackages().find(pkg => path.startsWith(pkg.path));
    return [...new Set(files.map(findPackage).filter(v => !!v))];
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield getFiles();
        const commits = yield getCommits();
        const pushedCommits = exports.sha
            ? commits.slice(commits.findIndex(commit => commit.sha === exports.sha) + 1)
            : commits;
        core.setOutput('files', files);
        core.setOutput('commits', commits);
        core.setOutput('labels', extractLabel(commits));
        core.setOutput('packages', affectedPackages(files));
        core.setOutput('pushed_commits', pushedCommits);
        core.setOutput('pushed_labels', extractLabel(pushedCommits));
    }
    catch (error) {
        core.setFailed(error.message);
    }
});
main();
