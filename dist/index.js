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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@stryker-mutator/core"));
const child_process_1 = require("child_process");
const path_1 = require("path");
function run(commandArgs) {
    const args = commandArgs.slice(2);
    const argsValuesArray = mapAllArgumentsToAnArray(args);
    const branchArgPredicate = (argArray) => argArray[0] === "branch";
    const pathArgPredicate = (argArray) => argArray[0] === "path";
    const branch = argsValuesArray.some(branchArgPredicate) && argsValuesArray.find(branchArgPredicate)[1].toString();
    const path = argsValuesArray.some(pathArgPredicate) && argsValuesArray.find(pathArgPredicate)[1].toString();
    const strykerConfPath = path_1.join(process.cwd(), path || "stryker.conf.js");
    child_process_1.exec(`git diff origin/${branch || "master"} --name-only | grep -E -v '.*\\.test.*' | grep -e 'src/.*\\.[jt]s'`, (error, stdout, stderr) => {
        if (error) {
            console.error(error.message);
            console.error(stderr);
            process.exit(1);
        }
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
    return module.default;
}
function applyArgumentsFromCommandLine(args) {
    return (config) => {
        mapAllArgumentsToAnArray(args).forEach((element) => {
            if (element[0] !== "branch" && element[0] !== "path") {
                config[element[0]] = element[1];
            }
        });
        return config;
    };
}
function mapAllArgumentsToAnArray(args) {
    return args.reduce((reducer, currentValue, currentIdx) => {
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
    }, []);
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