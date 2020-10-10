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
const github_1 = require("@actions/github");
const rules = {
    enhancement: /^feat|^new/i,
    bug: /^fix|^bug/i,
    documentation: /^doc/i,
    internal: /^refactor|^style/i,
    performance: /^perf/i,
    breaking: /BREAKING CHANGE/gmi,
};
const match = (msg) => Object.keys(rules).filter(label => !!msg.match(rules[label]));
const extract = (commits) => {
    const labels = commits.reduce((c, v) => {
        const [_, message] = v.message.match(/(?:^revert[:]?) "(.*)"/gmi) || [];
        console.log(_);
        if (!!message) {
            match(message).forEach(l => {
                const i = c.lastIndexOf(l);
                console.log(message, c[i]);
                i > 0 && delete c[i];
            });
            return c;
        }
        return c.concat(v.labels);
    }, []);
    console.log(labels, commits.map(v => v.labels));
    return [...new Set(labels)];
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const client = github_1.getOctokit(core.getInput('token', { required: true }));
    const [owner, repo] = core.getInput('repository', { required: true }).split('/');
    const pull_number = +core.getInput('pull_number', { required: true });
    const options = { repo, owner, pull_number };
    try {
        const commits = [];
        try {
            for (var _b = __asyncValues(client.paginate.iterator(client.pulls.listCommits, options)), _c; _c = yield _b.next(), !_c.done;) {
                const response = _c.value;
                response.data.forEach(({ sha, commit: { message, url } }) => commits.push({ sha, message, url, labels: match(message) }));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const labels = extract(commits);
    }
    catch (error) {
        core.setFailed(error.message);
    }
});
main();
