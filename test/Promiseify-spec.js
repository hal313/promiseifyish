import {Promiseify} from '../src/Promiseify';
import {isFunction} from '../src/Common';

/**
 *
 * @param {Function} fn the function to execute
 * @param {*[]} args the arguments for the function
 */
function execute(fn, args) {
    if (isFunction(fn)) {
        fn.apply({}, args);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Test functions
////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
// "No argument" functions (no arguments other than the callbacks)
/**
 * Simiulates an API call with no parameters (other than the callbacks). Will
 * synchronously invoke the success callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will always be invoked)
 * @param {Function} failureCallback the failure callback (will not be invoked)
 */
function noArgsSyncSuccess(successCallback, failureCallback) {
    execute(successCallback, [true]);
}
/**
 * Simiulates an API call with no parameters (other than the callbacks). Will
 * synchronously invoke the failure callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will not be invoked)
 * @param {Function} failureCallback the failure callback (will always be invoked)
 */
function noArgsSyncFailure(successCallback, failureCallback) {
    execute(failureCallback, [true]);
}
/**
 * Simiulates an API call with no parameters (other than the callbacks). Will
 * asynchronously invoke the success callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will always be invoked)
 * @param {Function} failureCallback the failure callback (will not be invoked)
 */
function noArgsAsyncSuccess(successCallback, failureCallback) {
    setTimeout(() => {
        execute(successCallback, [true]);
    });
}
/**
 * Simiulates an API call with no parameters (other than the callbacks). Will
 * asynchronously invoke the failure callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will not be invoked)
 * @param {Function} failureCallback the failure callback (will always be invoked)
 */
function noArgsAsyncFailure(successCallback, failureCallback) {
    setTimeout(() => {
        execute(failureCallback, [true]);
    });
}

////////////////////////////////////////////////////////////////////////////////
// "One argument" functions (one argument other than the callbacks)
/**
 * Simiulates an API call with one parameter (other than the callbacks). Will
 * synchronously invoke the success callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will always be invoked)
 * @param {Function} failureCallback the failure callback (will not be invoked)
 */
function argSyncSuccess(arg1, successCallback, failureCallback) {
    execute(successCallback, [[arg1]]);
}
/**
 * Simiulates an API call with one parameter (other than the callbacks). Will
 * synchronously invoke the failure callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will not be invoked)
 * @param {Function} failureCallback the failure callback (will always be invoked)
 */
function argSyncFailure(arg1, successCallback, failureCallback) {
    execute(failureCallback, [[arg1]]);
}
/**
 * Simiulates an API call with one parameter (other than the callbacks). Will
 * asynchronously invoke the success callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will always be invoked)
 * @param {Function} failureCallback the failure callback (will not be invoked)
 */
function argAsyncSuccess(arg1, successCallback, failureCallback) {
    setTimeout(() => {
        execute(successCallback, [[arg1]]);
    });
}
/**
 * Simiulates an API call with one parameter (other than the callbacks). Will
 * asynchronously invoke the failure callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will not be invoked)
 * @param {Function} failureCallback the failure callback (will always be invoked)
 */
function argAsyncFailure(arg1, successCallback, failureCallback) {
    setTimeout(() => {
        execute(failureCallback, [[arg1]]);
    });
}

////////////////////////////////////////////////////////////////////////////////
// "Multiple argument" functions (multiple arguments other than the callbacks)
/**
 * Simiulates an API call with multiple parameters (other than the callbacks). Will
 * synchronously invoke the success callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will always be invoked)
 * @param {Function} failureCallback the failure callback (will not be invoked)
 */
function argsSyncSuccess(arg1, arg2, successCallback, failureCallback) {
    execute(successCallback, [[arg1, arg2]]);
}
/**
 * Simiulates an API call with multiple parameters (other than the callbacks). Will
 * synchronously invoke the failure callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will not be invoked)
 * @param {Function} failureCallback the failure callback (will always be invoked)
 */
function argsSyncFailure(arg1, arg2, successCallback, failureCallback) {
    execute(failureCallback, [[arg1, arg2]]);
}
/**
 * Simiulates an API call with multiple parameters (other than the callbacks). Will
 * asynchronously invoke the success callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will always be invoked)
 * @param {Function} failureCallback the failure callback (will not be invoked)
 */
function argsAsyncSuccess(arg1, arg2, successCallback, failureCallback) {
    setTimeout(() => {
        execute(successCallback, [[arg1, arg2]]);
    });
}
/**
 * Simiulates an API call with multiple parameters (other than the callbacks). Will
 * asynchronously invoke the failure callback with the value 'true'.
 *
 * @param {Function} successCallback the success callback (will not be invoked)
 * @param {Function} failureCallback the failure callback (will always be invoked)
 */
function argsAsyncFailure(arg1, arg2, successCallback, failureCallback) {
    setTimeout(() => {
        execute(failureCallback, [[arg1, arg2]]);
    });
}


////////////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////////////
//
/**
 * Creates a deferred object instance.
 *
 * @return {Object} a deferred
 */
function createDeferred() {
    // Create the deferred
	const deferred = {
		promise: null,
		resolve: null,
		reject: null
	};

    // Set the properties
	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});

	return deferred;
}

/**
 * Creates a function which will check a value against an expected value and call an optional callback.
 *
 * @param {*} expected the expected value
 * @param {Function} [callback] the callback to invoke with the actual value
 * @return {Function} a function which takes in an actual value, asserts that the actual is the expected, invokes the callback and returns the actual value
 */
function createCheckFunction(expected, callback) {
    return function(actual) {
        expect(actual).toEqual(expected);
        execute(callback);
        return actual;
    }
}


////////////////////////////////////////////////////////////////////////////////
// Test generator functions
////////////////////////////////////////////////////////////////////////////////
//
/**
 * Tests a function for success. Tests the:
 *  -callback
 *  -the promise chain
 *  -callback AND promise chain together
 *
 * @param {Function} fn the function to test
 * @param {*} expectedValue the expected value
 * @param {*[]} args argument array
 */
function testSuccess(fn, expectedValue, args) {

    it('success callback only', () => {
        // Clone the args
        const localArgs = Array.from(args || []);
        // Promisify the function
        const promisifiedFunction = Promiseify(fn);
        // Set the deferreds
        const successCallbackDefer = createDeferred();
        // The returned promises (which must resolve in order to pass)
        const promises = [successCallbackDefer.promise];

        // Add the success callback only (no failure callback)
        localArgs.push(createCheckFunction(expectedValue, successCallbackDefer.resolve));
        // Invoke the function (and push the returned promise to the promises array)
        promises.push(
            promisifiedFunction.apply(this, localArgs)
        );

        // Return all promises which need to resolve for success
        return Promise.all(promises).catch(fail);
    });

    it('both callbacks', () => {
        // Clone the args
        const localArgs = Array.from(args || []);
        // Promisify the function
        const promisifiedFunction = Promiseify(fn);
        // Set the deferreds
        const successCallbackDefer = createDeferred();
        // The returned promises (which must resolve in order to pass)
        const promises = [successCallbackDefer.promise];

        // Invoke the promisified function, passing the success callback only
        localArgs.push(createCheckFunction(expectedValue, successCallbackDefer.resolve));
        // Invoke fail() if the function invokes the failure callback
        localArgs.push(fail);
        // Invoke the function (and push the returned promise to the promises array)
        promises.push(
            promisifiedFunction.apply(this, localArgs)
        );

        // Return all promises which need to resolve for success
        return Promise.all(promises).catch(fail);
    });

    it('then only', () => {
        // Clone the args
        const localArgs = Array.from(args || []);
        // Promisify the function
        const promisifiedFunction = Promiseify(fn);
        // Set the deferreds
        const thenDefer = createDeferred();
        // The returned promises (which must resolve in order to pass)
        const promises = [thenDefer.promise];

        // Invoke the promisified function, passing the success callback only
        localArgs.push(()=>{});
        // Invoke the function (and push the returned promise to the promises array)
        promises.push(
            promisifiedFunction.apply(this, localArgs)
            .then(createCheckFunction(expectedValue, thenDefer.resolve))
        );

        // Return all promises which need to resolve for success
        return Promise.all(promises).catch(fail);
    });

    it('success callback and then', () => {
        // Clone the args
        const localArgs = Array.from(args || []);
        // Promisify the function
        const promisifiedFunction = Promiseify(fn);
        // Set the deferreds
        const successCallbackDefer = createDeferred();
        const thenDefer = createDeferred();
        // The returned promises (which must resolve in order to pass)
        const promises = [successCallbackDefer.promise, thenDefer.promise];

        // Add the success callback only
        localArgs.push(createCheckFunction(expectedValue, successCallbackDefer.resolve));
        // Invoke the function (and push the returned promise to the promises array)
        promises.push(
            promisifiedFunction.apply(this, localArgs)
            .then(createCheckFunction(expectedValue, thenDefer.resolve))
        );

        // Return all promises which need to resolve for success
        return Promise.all(promises).catch(fail);
    });

    it('both callbacks and then', () => {
        // Clone the args
        const localArgs = Array.from(args || []);
        // Promisify the function
        const promisifiedFunction = Promiseify(fn);
        // Set the deferreds
        const successCallbackDefer = createDeferred();
        const thenDefer = createDeferred();
        // The returned promises (which must resolve in order to pass)
        const promises = [successCallbackDefer.promise, thenDefer.promise];

        // Invoke the promisified function, passing the success callback only
        localArgs.push(createCheckFunction(expectedValue, successCallbackDefer.resolve));
        localArgs.push(fail);
        promises.push(
            promisifiedFunction.apply(this, localArgs)
            .then(createCheckFunction(expectedValue, thenDefer.resolve))
        );

        // Return all promises which need to resolve for success
        return Promise.all(promises).catch(fail);
    });

}

/**
 * Tests a function for failure. Tests the:
 *  -callback
 *  -the promise chain
 *  -callback AND promise chain together
 *
 * @param {Function} fn the function to test
 * @param {*} expectedValue the expected value
 * @param {*[]} args argument array
 */

function testFailure(fn, expectedValue, args) {

    it('callback only', () => {
        // Clone the args
        const localArgs = Array.from(args || []);
        // Promisify the function
        const promisifiedFunction = Promiseify(fn);
        // Set the deferreds
        const failureCallbackDefer = createDeferred();
        // The returned promises (which must resolve in order to pass)
        const promises = [failureCallbackDefer.promise];

        // Invoke the promisified function, passing the failure callback only
        localArgs.push(fail);
        localArgs.push(createCheckFunction(expectedValue, failureCallbackDefer.resolve));
        promises.push(
            promisifiedFunction.apply(this, localArgs)
            // Fail if "then" is invoked
            .then(fail)
            // Swallow the exception (this is expected)
            .catch(()=>{})
        );

        // Return all promises which need to resolve for success
        return Promise.all(promises).catch(fail);
    });

    it('catch only', () => {
        // Clone the args
        const localArgs = Array.from(args || []);
        // Promisify the function
        const promisifiedFunction = Promiseify(fn);
        // Set the deferreds
        const catchDefer = createDeferred();
        // The returned promises (which must resolve in order to pass)
        const promises = [catchDefer.promise];

        // Invoke the promisified function, passing the failure callback only
        localArgs.push(fail);
        promises.push(
            promisifiedFunction.apply(this, localArgs)
            // Fail if "then" is invoked
            .then(fail)
            // Check the expectations
            .catch(createCheckFunction(expectedValue, catchDefer.resolve))
        );

        // Return all promises which need to resolve for success
        return Promise.all(promises).catch(fail);
    });

    it('callback and catch', () => {
        // Clone the args
        const localArgs = Array.from(args || []);
        // Promisify the function
        const promisifiedFunction = Promiseify(fn);
        // Set the deferreds
        const failureCallbackDefer = createDeferred();
        const catchDefer = createDeferred();
        // The returned promises (which must resolve in order to pass)
        const promises = [failureCallbackDefer.promise, catchDefer.promise];

        // Invoke the promisified function, passing the failure callback only
        localArgs.push(fail);
        localArgs.push(createCheckFunction(expectedValue, failureCallbackDefer.resolve));
        promises.push(
            promisifiedFunction.apply(this, localArgs)
            .then(fail)
            .catch(createCheckFunction(expectedValue, catchDefer.resolve))
        );

        // Return all promises which need to resolve for success
        return Promise.all(promises).catch(fail);
    });
}

describe('Functions', () => {

    describe('callback support', () => {

        describe('no args', () => {

            describe('synchronous', () => {

                describe('success', () => testSuccess(noArgsSyncSuccess, true));

                describe('failure', () => testFailure(noArgsSyncFailure, true));

            });

            describe('asynchronous', () => {

                describe('success', () => testSuccess(noArgsAsyncSuccess, true));

                describe('failure', () => testFailure(noArgsAsyncFailure, true));

            });

        });

        describe('singluar arg', () => {

            const args = ['one'];
            const expectedValue = Array.from(args);

            describe('synchronous', () => {

                describe('success', () => testSuccess(argSyncSuccess, args, expectedValue));

                describe('failure', () => testFailure(argSyncFailure, args, expectedValue));

            });

            describe('asynchronous', () => {

                describe('success', () => testSuccess(argAsyncSuccess, args, expectedValue));

                describe('failure', () => testFailure(argAsyncFailure, args, expectedValue));

            });

        });

        describe('multiple args', () => {

            const args = ['one', 'two'];
            const expectedValue = Array.from(args);

            describe('synchronous', () => {

                describe('success', () => testSuccess(argsSyncSuccess, args, expectedValue));

                describe('failure', () => testFailure(argsSyncFailure, args, expectedValue));

            });

            describe('asynchronous', () => {

                describe('success', () => testSuccess(argsAsyncSuccess, args, expectedValue));

                describe('failure', () => testFailure(argsAsyncFailure, args, expectedValue));

            });

        });

    });

    describe('no callback support', () => {

        /**
         * Simiulates an API call with arbitrary parameters (but no callbacks). Will
         * synchronously invoke the success callback with an array of the passed in arguments.
         *
         * @return {*[]} an array of the passed in arguments
         */
        function fnSyncSuccess() {
            return Array.from(arguments);
        }

        /**
         * Simiulates an API call with arbitrary parameters (but no callbacks). Will
         * synchronously invoke the success callback with an array of the passed in arguments. Will always
         * throw fnSyncFailure.expectedValue.
         */
        function fnSyncFailure() {
            throw fnSyncFailure.expectedValue;
        }
        fnSyncFailure.expectedValue = 'Error!';

        describe('no parameters', () => {

            describe('success', () => {

                it('should return a promise which resolves when the function executes successfully', () => {
                    // Promisify the function
                    const promisifiedFunction = Promiseify(fnSyncSuccess);
                    // Create the arguments
                    const args = [];
                    // Create the expected value (from the arguments)
                    const expectedValue = Array.from(args);

                    // Return the promise chain
                    return promisifiedFunction.apply({}, args)
                        // Validate the result
                        .then(createCheckFunction(expectedValue))
                        // Fail if "catch" is invoked
                        .catch(fail);
                });

            });

            describe('failure', () => {

                it('should return a promise which rejects when the function throws an error', () => {
                    // Promisify the function
                    const promisifiedFunction = Promiseify(fnSyncFailure);
                    // Create the arguments
                    const args = [];

                    // Return the promise chain
                    return promisifiedFunction.apply({}, args)
                        // Fail if "then" is invoked
                        .then(fail)
                        // Validate the failure
                        .catch(createCheckFunction(fnSyncFailure.expectedValue));
                });

            });
        });

        describe('parameters', () => {

            describe('success', () => {

                it('should return a promise which resolves when the function executes successfully', () => {
                    // Promisify the function
                    const promisifiedFunction = Promiseify(fnSyncSuccess);
                    // Create the arguments
                    const args = [1, 2, 3];
                    // Create the expected value (from the arguments)
                    const expectedValue = Array.from(args);

                    // Return the promise chain
                    return promisifiedFunction.apply({}, args)
                        // Validate the result
                        .then(createCheckFunction(expectedValue))
                        // Fail if "catch" is invoked
                        .catch(fail);
                });
            });

            describe('failure', () => {

                it('should return a promise which rejects when the function throws an error', () => {
                    // Promisify the function
                    const promisifiedFunction = Promiseify(fnSyncFailure);
                    // Create the args
                    const args = [1, 2, 3];

                    // Return the promise chain
                    return promisifiedFunction.apply({}, args)
                        // Fail if "then" is invoked
                        .then(fail)
                        // Validate the error
                        .catch(createCheckFunction(fnSyncFailure.expectedValue));
                });

            });

        });

    });

});

describe('Objects', () => {

    it('should promisify all the member functions', () => {
        let someObject = {
            undefinedValue: undefined,
            nullValue: null,
            numberValue: 1,
            booleanValue: true,
            stringValue: 'some string',
            functionValue: () => true
        };

        let result = someObject.functionValue();
        expect(result.then).not.toBeDefined();
        expect(result.catch).not.toBeDefined();

        let promisifiedObject = Promiseify(someObject);
        expect(isFunction(promisifiedObject.undefinedValue)).toBe(false);
        expect(isFunction(promisifiedObject.nullValue)).toBe(false);
        expect(isFunction(promisifiedObject.numberValue)).toBe(false);
        expect(isFunction(promisifiedObject.booleanValue)).toBe(false);
        expect(isFunction(promisifiedObject.stringValue)).toBe(false);
        expect(isFunction(promisifiedObject.functionValue)).toBe(true);

        // Execute the function
        result = promisifiedObject.functionValue();
        // Ducktype for Promise
        expect(result.then).toBeDefined();
        expect(result.catch).toBeDefined();

        // Return the promise chain
        return result.catch(fail);
    });

});


describe('Other Types', () => {

    it('should throw on undefined', () => {
        expect(() => Promiseify()).toThrow();
        expect(() => Promiseify(undefined)).toThrow();
    });

    it('should throw on null', () => {
        expect(() => Promiseify(null)).not.toThrow();
    });

    it('should throw on boolean', () => {
        expect(() => Promiseify(true)).toThrow();
        expect(() => Promiseify(false)).toThrow();
    });

    it('should throw on a number', () => {
        expect(() => Promiseify(-1)).toThrow();
        expect(() => Promiseify(0)).toThrow();
        expect(() => Promiseify(1)).toThrow();

        expect(() => Promiseify(-0.1)).toThrow();
        expect(() => Promiseify(0.1)).toThrow();

        expect(() => Promiseify(Infinity)).toThrow();
        expect(() => Promiseify(-Infinity)).toThrow();

        expect(() => Promiseify(NaN)).toThrow();
    });

    it('should throw on a string', () => {
        expect(() => Promiseify('')).toThrow();
        expect(() => Promiseify('some string')).toThrow();
    });

});
