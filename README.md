# [promiseifyish](https://github.com/hal313/promiseifyish)

> Wraps functions and objects into promises.

[![Build Status](http://img.shields.io/travis/hal313/promiseifyish/master.svg?style=flat-square)](https://travis-ci.org/hal313/promiseifyish)
[![NPM version](http://img.shields.io/npm/v/@hal313/promiseifyish.svg?style=flat-square)](https://www.npmjs.com/package/@hal313/promiseifyish)
[![Dependency Status](http://img.shields.io/david/hal313/promiseifyish.svg?style=flat-square)](https://david-dm.org/hal313/promiseifyish)

## Introduction

Wraps functions of the form `fn([...args], successCallback, failureCallback)` into Promises. This can be useful in cases where functions with callbacks are being chained together. Using promises avoids some
flow issues and often simplifies the logic.

For example:

```javascript
someFunction1(() => {
    someFunction2(() => {
        someFunction3(() => {
            someFunction4(() => {}, errorHandler);
        }, errorHandler);
    }, errorHandler;
}, errorHandler);
```

Becomes

```javascript
someFunction1()
    .then(someFunction2)
    .then(someFunction3)
    .then(someFunction4)
    .catch(errorHandler)
```

*WARNING*: If a success callback is specified as a non-function (such as `null` or `undefined`) *AND* a failure callback is specifed as a function, then the failure function may not correctly be invoked. See [issue 4](https://github.com/hal313/promiseifyish/issues/4) in GitHub.

See an [example](https://hal313.github.io/settings-manager-example/).

## Usage

Use `Promiseifyish` to promiseify a function or an object. Project environment dictates how the code is imported. ES6, ES5 and AMD/CommonJS are all supported. Comprehensive documentation and examples may be found at the [GitHub pages](https://hal313.github.io/promiseifyish/).

### As a function

```javascript
/**
 * A function to demonstrate callback behavior.
 *
 * @param {boolean} success if true, the success callback will be invoked
 * @param {*} value the value to pass to the callback
 * @param {Function} [successCallback] the success callback
 * @param {Function} [failureCallback] the failure callback
 */
function someFunction(success, value, successCallback, failureCallback) {
    if (success && 'function' === typeof successCallback) {
        successCallback(value);
    } else if (!success && 'function' === typeof failureCallback) {
        failureCallback(value);
    }
}

// Standard usage:
someFunction(true, 'some value',
    value => console.log('standard', 'succes', value),
    error => console.log('standard', 'failure', error)
);


// After promisification:
var promisifiedFunction = Promiseifyish.Promiseify(someFunction);
// Invoke as a promise
promisifiedFunction(true, 'some value')
    .then(value => console.log('promiseified', 'success', value))
    .catch(error => console.log('promiseified', 'failure', error));
```

### As an Object

```javascript
// Standard usage
var someObject = {
    booleanMember: true,
    stringMember: 'some value',
    functionMember: someFunction(success, value, successCallback, failureCallback) {
        if (success && 'function' === typeof successCallback) {
            successCallback(value);
        } else if (!success && 'function' === typeof failureCallback) {
            failureCallback(value);
        }
    }
};
// Invoke the function
someObject.functionMember(true, 'some value',
    value => console.log('succes', value),
    error => console.log('failure', error)
);


// After promisification:
// Promiseify the object
var promiseifiedObject = Promiseifyish.Promiseify(someObject);
// All functions are now promises
promiseifiedObject.functionMember(true, 'some value')
    .then(value => console.log('success', value))
    .catch(error => console.log('failure', error));
```

## Advanced Usage

Passing *options* to the `Promiseify` function can alter the behavior of promiseification.

If neither `only` nor `include` are specified, all functions are included *except for* functions on `Object`.

### only

Using `{only: ['function1'[, ..., 'functionN']]}` as the `options` object parameter will promiseify *only* the specified functions, regardless of any other options (specifically `exclude`).

### include

Using `{include: ['function1'[, ..., 'functionN']]` as the `options` object parameter will include only the specified functions, subject to any function in `exclude`.

### exclude

Using `{exclude: ['function1'[, ..., 'functionN']]` as the `options` object parameter will exclude the specified functions from promiseification. This value is not used
when `only` is used.

### outcomeRedirector

Using `{outcomeRedirector: (args) => { /* return true or false */}}` as the `options` object parameter will

Some API's are not designed with both a success callback and a failure callback.

## Developing

### Setup

```bash
npm install
```

### Running Tests

To run tests against the source code and dist folder (including coverage):

```bash
npm test
```

Runing tests continuously:

```bash
npm run test:watch
```

### Building

A build produces the contents of the `dist` folder:

* A UMD version of the library (`dist/Promiseifyish.js`)
* An ES6 version of the library (`dist/Promiseifyish.es6.js`)

Building:

```bash
npm run build
```

Building continuously on source changes:

```bash
npm run watch:build
```

### Distribution

A distribution adds to the build:

* A minified UMD version of the library (`dist/Promiseifyish.min.js`)
* A source map (`dist/Promiseifyish.min.js.map`)

Building a distribution:

```bash
npm run dist
```

Building a distribution continuously on source changes:

```bash
npm run watch:dist
```

### End to End Development

Running the build pipeline, including tests, continuously:

```bash
npm run watch:develop
```
