// The script is loaded already

// Get a reference to the Promiseify function
var Promiseify = Promiseifyish.Promiseify,
    promisifiedFunction,
    $standardResultElement = $('#result-standard'),
    $promisifiedResultElement = $('#result-promiseified');

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
    function onSuccess(value) {
        $standardResultElement.html(`'${value}'`);
    },
    function onFailure(error) {
        console.error('standard', 'failure', error);
    }
);


// After promisification:
promisifiedFunction = Promiseify(someFunction);
// Invoke as a promise
promisifiedFunction(true, 'some value')
    // 'value' is an array of all the parameters which the callback would normally have been executed with
    .then(function onSuccess(value) {
        $promisifiedResultElement.html(`'${value[0]}'`);
    })
    .catch(function onFailure(error) {
        console.error('promisified', 'failure', error);
    });
