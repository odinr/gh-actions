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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lerna_changelog_1 = __importDefault(require("lerna-changelog"));
const config_1 = require("./config");
class GG extends lerna_changelog_1.default {
    packageFromPath(path) {
        const parts = path.split("/");
        const ff = config_1.packages.find(pkg => path.startsWith(pkg));
        if (ff) {
            return parts[1];
        }
    }
}
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield new GG(config_1.config).createMarkdown();
        console.log(result);
    }
    catch (error) {
        console.error(error.message);
    }
});
main();
