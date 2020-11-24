# Stryker diff runner

This module provide a [stryker](https://github.com/stryker-mutator) runner that allow to run mutation testing only on files diff with default branch.

[![Build Status](https://travis-ci.com/tverhoken/stryker-diff-runner.svg?branch=master)](https://travis-ci.org/tverhoken/stryker-diff-runner)
[![Coverage Status](https://coveralls.io/repos/github/tverhoken/stryker-diff-runner/badge.svg?branch=master)](https://coveralls.io/github/tverhoken/stryker-diff-runner?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/tverhoken/stryker-diff-runner/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tverhoken/stryker-diff-runner?targetFile=package.json)

## Getting started

### Prerequisites

You will need the following things properly installed on your computer :

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) >= 12.0.0

### Installation

This module required `@stryker-mutator/core` >=3 on your project to work. Install it and these dependencies like so :

```
$ npm add @stryker-mutator/core stryker-diff-runner
```

If you want to use this module with an older version of Stryker, you can install the v1 package :

```
$ npm add @stryker-mutator/core@2 @stryker-mutator/api@2 stryker-diff-runner@1
```

### Usage

Add a NPM script to run Stryker mutation testing through the diff runner

```javascript
{
    // ...
    "scripts": {
        // ...
        "test:mutation:diff": "stryker-diff-runner"
    }
}
```

All stryker command arguments can be passed to the diff runner.

### Custom commands

By default `stryker-diff-runner` performs a comparison with the master branch and looks for the file stryker.conf.js in the root directory.

To change these settings include the `--branch` and `--path` commands. Check the example below:

```javascript
{
    // ...
    "scripts": {
        // ...
        "test:mutation:diff": "stryker-diff-runner --path test/stryker.conf.js --branch main"
    }
}
```

## Development

In order to contribute and be able to start developing on the project, you will have to follow following steps :

```
$ git clone <repository>
$ cd <repository>
$ npm install
```

### Running tests

* `npm run test`

### Building

* `npm run build`

## Contacts

Thomas VERHOKEN [![https://twitter.com/tverhoken][1.1]][1]

[1]: https://twitter.com/tverhoken
[1.1]: http://i.imgur.com/wWzX9uB.png