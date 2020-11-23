import { StrykerOptions } from "@stryker-mutator/api/core";
import Stryker from "@stryker-mutator/core";
import { exec } from "child_process";
import { join } from "path";

export default function run(commandArgs: string[]) {

  const args = commandArgs.slice(2);
  const argsValuesArray = mapAllArgumentsToAnArray(args);
  const branchArgPredicate = (argArray: Array<string | number>) => argArray[0] === "branch";
  const pathArgPredicate = (argArray: Array<string | number>) => argArray[0] === "path";

  const branch = argsValuesArray.some(branchArgPredicate) && argsValuesArray.find(branchArgPredicate)![1].toString();
  const path = argsValuesArray.some(pathArgPredicate) && argsValuesArray.find(pathArgPredicate)![1].toString();

  const strykerConfPath = join(process.cwd(), path || "stryker.conf.js");

  exec(
    `git diff origin/${branch || "master"} --name-only | grep -E -v '.*\\.test.*' | grep -e 'src/.*\\.[jt]s'`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(error.message);
        console.error(stderr);
        process.exit(1);
      }

      const filesToMutate = stdout.split("\n");
      filesToMutate.splice(filesToMutate.length - 1, 1);

      import(strykerConfPath)
        .then(initConfig)
        .then(applyArgumentsFromCommandLine(args))
        .then(applyFilesToMutate(filesToMutate))
        .then(launchStryker);
    });
}

function filterExcludedFilames(fileNames: string[], matchers: string[]) {
  const exclusionMatchers = matchers
    .filter((matcher) => matcher[0] === "!")
    .map((matcher) => matcher.substr(1));
  return fileNames.filter((fileName) => (
    exclusionMatchers.every((matcher) => fileName !== matcher)
  ));
}

function initConfig(module: any) {
  return module.default;
}

function applyArgumentsFromCommandLine(args: string[]) {
  return (config: StrykerOptions) => {
    mapAllArgumentsToAnArray(args).forEach((element) => {
      if (element[0] !== "branch" && element[0] !== "path") {
        config[element[0]] = element[1];
      }
    });
    return config;
  };
}

function mapAllArgumentsToAnArray(args: string[]) {
  return args.reduce<Array<Array<string | number>>>((reducer, currentValue, currentIdx) => {
    const newReducer = [...reducer];
    if (currentIdx % 2 === 0) {
      newReducer.push([currentValue.slice(2)]);
    } else {
      if (Number.isNaN(parseInt(currentValue, 10))) {
        newReducer[reducer.length - 1].push(currentValue);
      } else {
        newReducer[reducer.length - 1].push(parseInt(currentValue, 10));
      }
    }
    return newReducer;
  }, []);
}

function applyFilesToMutate(filesToMutate: string[]) {
  return (config: StrykerOptions): StrykerOptions => {
    const mutate = config.mutate;
    mutate.splice(0, 1);
    const filteredFilesToMutate = filterExcludedFilames(filesToMutate, mutate);
    return { ...config, mutate: mutate.concat(filteredFilesToMutate) };
  };
}

function launchStryker(config: StrykerOptions) {
  const stryker = new Stryker(config);

  return stryker.runMutationTest();
}
