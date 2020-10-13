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
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const core = __importStar(require("@actions/core"));
const child_process_1 = require("child_process");
const repo = core.getInput('repository', { required: true });
const nextVersion = core.getInput('next_version') || '';
const ignoreCommitters = [
    "dependabot-bot",
    "dependabot[bot]",
    "greenkeeperio-bot",
    "greenkeeper[bot]",
    "renovate-bot",
    "renovate[bot]",
];
const labels = {
    breaking: ":boom: Breaking Change",
    enhancement: ":rocket: Enhancement",
    bug: ":bug: Bug Fix",
    documentation: ":memo: Documentation",
    internal: ":house: Internal",
};
const rootPath = String(child_process_1.execSync("git rev-parse --show-toplevel")).trim();
exports.config = {
    repo,
    rootPath,
    labels,
    nextVersion,
    ignoreCommitters,
};
exports.default = exports.config;
