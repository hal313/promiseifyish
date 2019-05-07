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

## Usage

Use `Promiseifyish` to promiseify a function or an object. Project environment dictates how the code is imported. ES6, ES5 and AMD/CommonJS are all supported.

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
    value => console.log('succes', value),
    error => console.log('failure', error)
);


// After promisification:
var promisifiedFunction = Promiseifyish.Promiseify(someFunction);
// Invoke as a promise
promisifiedFunction(true, 'some value')
    .then(value => console.log('success', value))
    .catch(error => console.log('failure', error));
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

## Setup

```bash
npm install
```

### Running Tests

To run tests against the source code and dist folder (including coverage):

```bash
npm test
```
