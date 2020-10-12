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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const inputs_1 = require("./inputs");
const rules = {
    enhancement: /^feat|^new/i,
    bug: /^fix|^bug/i,
    documentation: /^doc/i,
    internal: /^refactor|^style/i,
    performance: /^perf/i,
    breaking: /^(?!revert).*BREAKING CHANGE/mi,
};
const emojis = {
    enhancement: ':rocket:',
    bug: ':bug:',
    documentation: ':pencil:',
    internal: ':house:',
    performance: ':chart_with_upwards_trend:',
    breaking: ':boom:',
};
const match = (msg) => Object.keys(rules).filter(label => !!msg.match(rules[label]));
const extract = (commits) => {
    const labels = commits.reduce((c, v) => c.concat(v.labels), []);
    return [...new Set(labels)];
};
const createLog = (commits) => {
    return Object.keys(rules).map(type => {
        const selection = commits.filter(commit => commit.labels.includes(type));
        const messages = selection.map(commit => [`[#${commit.sha.slice(0, 7)}](${commit.url})`, commit.message.replace(/^\w+[:]?\s?/, '')].join(' - '));
        return messages.length ? `## ${emojis[type]} ${type}\n\n${messages.join("\n")}` : '';
    }).join("\n");
};
const getCommits = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
        const commits = [];
        try {
            for (var _b = __asyncValues(inputs_1.client.paginate.iterator(inputs_1.client.pulls.listCommits, { repo: inputs_1.repo, owner: inputs_1.owner, pull_number: inputs_1.pull_number })), _c; _c = yield _b.next(), !_c.done;) {
                const response = _c.value;
                for (const commit of response.data) {
                    const { sha, commit: { message, url } } = commit;
                    commits.push({ sha, message, url, labels: match(message) });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return commits;
    }
    catch (error) {
        throw Error(error.message);
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const update = !!core.getInput('update');
    const before = core.getInput('before');
    try {
        const commits = yield getCommits();
        const labels = extract(update ? commits.slice(commits.findIndex(commit => commit.sha === before) + 1) : commits);
        const log = createLog(commits);
        yield inputs_1.client.pulls.update({
            owner: inputs_1.owner, repo: inputs_1.repo,
            pull_number: inputs_1.pull_number,
            body: log
        });
        labels.length && (yield inputs_1.client.issues.addLabels({
            owner: inputs_1.owner, repo: inputs_1.repo, issue_number: inputs_1.pull_number, labels
        }));
    }
    catch (error) {
        core.setFailed(error.message);
    }
});
main();
