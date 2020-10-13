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
const lerna_changelog_1 = require("lerna-changelog");
const repo = core.getInput('repository', { required: true });
const nextVersion = "v.1.2.3";
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
const { exec } = require("child_process");
const run = (cmd) => new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            reject(error);
        }
        if (stderr) {
            reject(Error(stderr));
        }
        resolve(stdout);
    });
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = {
            repo,
            labels,
            nextVersion,
            ignoreCommitters,
            rootPath: yield run("git rev-parse --show-toplevel")
        };
        const result = yield new lerna_changelog_1.Changelog(config).createMarkdown();
        console.log(result);
    }
    catch (error) {
        console.error(error.message);
    }
});
main();
