// Load the package
let Promiseifyish = require('@hal313/promiseifyish');

// Get a reference to the Promiseify function
let Promiseify = Promiseifyish.Promiseify;

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
let promisifiedFunction = Promiseify(someFunction);
// Invoke as a promise
promisifiedFunction(true, 'some value')
    // 'value' is an array of all the parameters which the callback would normally have been executed with
    .then(value => console.log('promisified', 'success', value))
    .catch(error => console.log('promisified', 'failure', error));
