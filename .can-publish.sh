#!/bin/sh

if [ $TRAVIS_BRANCH = '@stryker-mutator-v2' ] && [ $TRAVIS_PULL_REQUEST = 'false' ]; then echo true; else echo false; fi