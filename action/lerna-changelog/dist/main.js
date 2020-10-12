"use strict";
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
const lerna_changelog_1 = require("lerna-changelog");
const configuration_1 = require("lerna-changelog/lib/configuration");
const inputs_1 = require("./inputs");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = configuration_1.load({
            repo: inputs_1.repo
        });
        const result = new lerna_changelog_1.Changelog(config);
        console.log(result);
    }
    catch (error) {
        console.error(error.message);
    }
});
main();
