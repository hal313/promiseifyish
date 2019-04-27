# [promiseifyish](https://github.com/hal313/promisifyish)

> Wraps functions and objects into promises.

[![Build Status](http://img.shields.io/travis/hal313/promisifyish/master.svg?style=flat-square)](https://travis-ci.org/hal313/promisifyish)
[![NPM version](http://img.shields.io/npm/v/promisifyish.svg?style=flat-square)](https://www.npmjs.com/package/promisifyish)
[![Dependency Status](http://img.shields.io/david/hal313/promisifyish.svg?style=flat-square)](https://david-dm.org/hal313/promisifyish)

## Introduction
Wraps functions of the form fn([...args], successCallback, failureCallback) into Promises.

## Setup
```
npm install
```

### Running Tests
To run tests against the source code and dist folder (including coverage):
```
npm test
``


# Deploying
This is a basic script which can be used to build and deploy (to NPM) the project.

```
export VERSION=...
git checkout -b release/$VERSION
npm run test
npm version --no-git-tag-version patch
git add package*
git commit -m 'Version bump'
npx auto-changelog -p
git add CHANGELOG.md
git commit -m 'Updated changelog'
git checkout master
git merge --no-ff release/$VERSION
git tag -a -m 'Tagged for release' $VERSION
git branch -d release/$VERSION
git checkout develop
git merge master
git push --all && git push --tags
```
