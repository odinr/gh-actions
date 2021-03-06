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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pull_number = exports.repo = exports.owner = exports.client = exports.token = void 0;
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
exports.token = core.getInput('token', { required: true });
exports.client = github_1.getOctokit(core.getInput('token', { required: true }));
_a = core.getInput('repository', { required: true }).split('/'), exports.owner = _a[0], exports.repo = _a[1];
exports.pull_number = +core.getInput('pull_number', { required: true });
exports.default = { client: exports.client, repo: exports.repo, owner: exports.owner, token: exports.token, pull_number: exports.pull_number };
