#!/bin/sh

if [ $TRAVIS_BRANCH = 'master' ] && [ $TRAVIS_PULL_REQUEST = 'false' ]; then echo true; else echo false; fi