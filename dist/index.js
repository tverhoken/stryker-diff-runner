"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@stryker-mutator/api/config");
const core_1 = __importDefault(require("@stryker-mutator/core"));
const child_process_1 = require("child_process");
const path_1 = require("path");
function run(commandArgs) {
    const strykerConfPath = path_1.join(process.cwd(), "stryker.conf.js");
    child_process_1.exec("git diff origin/master --name-only | grep -E -v '.*\\.test.*' | grep -e 'src/.*\\.[jt]s'", (error, stdout, stderr) => {
        if (error) {
            console.error(error.message);
            console.error(stderr);
            process.exit(1);
            return;
        }
        const args = commandArgs.slice(2);
        const filesToMutate = stdout.split("\n");
        filesToMutate.splice(filesToMutate.length - 1, 1);
        Promise.resolve().then(() => __importStar(require(strykerConfPath))).then(initConfig)
            .then(applyArgumentsFromCommandLine(args))
            .then(applyFilesToMutate(filesToMutate))
            .then(launchStryker);
    });
}
exports.default = run;
function filterExcludedFilames(fileNames, matchers) {
    const exclusionMatchers = matchers
        .filter((matcher) => matcher[0] === "!")
        .map((matcher) => matcher.substr(1));
    return fileNames.filter((fileName) => (exclusionMatchers.every((matcher) => fileName !== matcher)));
}
function initConfig(module) {
    const config = new config_1.Config();
    module.default(config);
    return config;
}
function applyArgumentsFromCommandLine(args) {
    return (config) => {
        args.reduce((reducer, currentValue, currentIdx) => {
            const newReducer = [...reducer];
            if (currentIdx % 2 === 0) {
                newReducer.push([currentValue.slice(2)]);
            }
            else {
                if (Number.isNaN(parseInt(currentValue, 10))) {
                    newReducer[reducer.length - 1].push(currentValue);
                }
                else {
                    newReducer[reducer.length - 1].push(parseInt(currentValue, 10));
                }
            }
            return newReducer;
        }, []).forEach((element) => {
            config[element[0]] = element[1];
        });
        return config;
    };
}
function applyFilesToMutate(filesToMutate) {
    return (config) => {
        const mutate = config.mutate;
        mutate.splice(0, 1);
        const filteredFilesToMutate = filterExcludedFilames(filesToMutate, mutate);
        return { ...config, mutate: mutate.concat(filteredFilesToMutate) };
    };
}
function launchStryker(config) {
    const stryker = new core_1.default(config);
    return stryker.runMutationTest();
}
//# sourceMappingURL=index.js.map