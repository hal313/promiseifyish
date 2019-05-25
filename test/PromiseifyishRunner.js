import { createTestFunctionDescriptor } from './TestFunctionGenerator.js';
import { SuperClass, SubClass } from './ClassDefinitions.js';

/**
 * A convienence method for testing Promiseifyish implementation.
 *
 * @param {Promiseifyish} Promiseifyish the implementation to use for testing
 */
export function run(Promiseifyish) {

    // The Promiseify function
    const Promiseify = Promiseifyish.Promiseify;
    // The isFunction function
    const isFunction = Promiseifyish.isFunction;
    // The execute funtion
    const execute = Promiseifyish.execute;


    /**
     * Waits for the descriptor's wrapped promise to finish. Returns:
     * {
     *   descriptor: descriptor,
     *   results: <descriptor.execution.result resolution>
     * }
     *
     * @param {Object} descriptor the execution descriptor
     * @results {Promise} resolves when the wrapped function resolves
     */
    function waitForPromise(descriptor) {

        /**
         * Checks that the promise result is same as the arguments defined
         * in the execution descriptor.
         *
         * @param {object} result the promise result
         */
        function checkPromiseResult(result) {
            // Expect that the callback result is correct
            expect(result).toEqual(descriptor.arguments.callback);
            return descriptor;
        }

        if (descriptor.success) {
            return descriptor.execution.result
                // Check that the promisified function did NOT cause "catch" to be executed
                .catch(fail)
                .then(checkPromiseResult);
        } else {
            return descriptor.execution.result
                // Check that the promisified function did NOT cause "then" to be executed
                .then(fail)
                .catch(checkPromiseResult);
        }
    }

    /**
     * Evaluates execution results.
     *
     * @param {Object} descriptor the execution descriptor
     */
    function checkExecution(descriptor) {


        // Check that the function was executed with the correct arguments
        //
        // Get the expexted arguments passed to the test function
        let expectedExecutionArguments = Array.from(descriptor.arguments.testFunction);
        // Add two callbacks - the wrapped success handler and the wrapped failure handler
        expectedExecutionArguments.push(expect.any(Function));
        expectedExecutionArguments.push(expect.any(Function));
        // Check that the test function was invoked correctly
        expect(descriptor.testFunction).toBeCalledWith(...expectedExecutionArguments);


        // Check that IF success, the success callback was executed with the right arguments
        if (descriptor.success) {
            if (descriptor.callbacks.success) {
                expect(descriptor.callbacks.success).toBeCalledWith(...descriptor.arguments.callback);
            }
            // IF success, the failure callback should NOT have been invoked
            if (descriptor.callbacks.failure) {
                expect(descriptor.callbacks.failure).not.toHaveBeenCalled();
            }
        } else if (!descriptor.success) {
            // Check that IF fail, the failure callback was executed with the right arguments
            if (!!descriptor.callbacks.failure) {
                expect(descriptor.callbacks.failure).toBeCalledWith(...descriptor.arguments.callback);
            }
            // IF failure, the success callback should not have been invoked
            if (!!descriptor.callbacks.successCallback) {
                expect(descriptor.callbacks.successCallback).not.toHaveBeenCalled();
            }
        }

        // Return for chaining
        return descriptor;
    }

    /**
     * Runs a suite of tests, covering all combinations of callbacks (none, success only and success & failure).
     *
     * @param {boolean} success true, if the test function should be a success
     * @param {boolean} sync true, if the callback should executed synchronously
     */
    function runSuite(success, sync) {

        /**
         * Tests a function with none, success and success/failure callbacks.
         *
         * @param {*[]} functionArguments array of function arguments
         * @param {*[]} callbackArguments array of callback arguments
         */
        function runCallbackCombos(functionArguments, callbackArguments) {

            let successHandler = jest.fn();
            let failureHandler = jest.fn();

            beforeEach(() => {
                // Assign the mocks
                successHandler.mockClear();
                failureHandler.mockClear();
            });

            it(`should invoke the correct functions and pass the correct values with ${(functionArguments||[]).length} arguments in function, ${(callbackArguments||[]).length} arguments in callbacks, no callbacks passed`, () => {
                return createTestFunctionDescriptor(Promiseifyish, functionArguments, callbackArguments, success, sync).execute()
                    .then(waitForPromise)
                    .then(checkExecution)
                    .catch(fail);
            });

            it(`should invoke the correct functions and pass the correct values with ${(functionArguments||[]).length} arguments in function, ${(callbackArguments||[]).length} arguments in callbacks, "success callback" only`, () => {
                return createTestFunctionDescriptor(Promiseifyish, functionArguments, callbackArguments, success, sync, successHandler).execute()
                    .then(waitForPromise)
                    .then(checkExecution)
                    .then(descriptor => {
                        // Check that the success handler was invoked
                        if (!!descriptor.success) {
                            expect(successHandler).toHaveBeenCalledWith(...(callbackArguments||[]));
                        }
                    })
                    .catch(fail);
            });

            it(`should invoke the correct functions and pass the correct values with ${(functionArguments||[]).length} arguments in function, ${(callbackArguments||[]).length} arguments in callbacks, "success callback" and "failure callback"`, () => {
                return createTestFunctionDescriptor(Promiseifyish, functionArguments, callbackArguments, success, sync, successHandler, failureHandler).execute()
                    .then(waitForPromise)
                    .then(checkExecution)
                    .then(descriptor => {
                        // Check that the success handler was invoked
                        if (!!descriptor.success) {
                            expect(successHandler).toHaveBeenCalledWith(...(callbackArguments||[]));
                        } else {
                            // Check that the failure handler was invoked
                            expect(failureHandler).toHaveBeenCalledWith(...(callbackArguments||[]));
                        }
                    })
                    .catch(fail);
            });

        }

        // Generate combinations of parameters (function and callback)
        [null, ['function1'], ['function1', 'function2']].forEach(functionArguments => {
            [null, ['callback1'], ['callback1', 'callback2']].forEach(callbackArguments => {
                runCallbackCombos(functionArguments, callbackArguments);
            });
        });

    }

    describe('Promiseifyish', () => {

        describe('Execution', () => {

            // Generate all success/fail and sync/async combinations
            [true, false].forEach(sync => {
                describe(!!sync ? 'Synchronous' : 'Asynchronous', () => {
                    [true, false].forEach(success => {
                        describe(!!success ? 'Success' : 'Failure', () => {
                            runSuite(success, sync);
                        });
                    });
                });
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

        describe('Objects', () => {

            it('should promiseify all the member functions', () => {
                let someObject = {
                    undefinedValue: undefined,
                    nullValue: null,
                    numberValue: 1,
                    booleanValue: true,
                    stringValue: 'some string',
                    functionValue: successCallback => execute(successCallback)
                };

                let fn = someObject.functionValue(()=>{});
                expect(fn).not.toBeDefined();

                let promisifiedObject = Promiseify(someObject);
                expect(isFunction(promisifiedObject.undefinedValue)).toBe(false);
                expect(isFunction(promisifiedObject.nullValue)).toBe(false);
                expect(isFunction(promisifiedObject.numberValue)).toBe(false);
                expect(isFunction(promisifiedObject.booleanValue)).toBe(false);
                expect(isFunction(promisifiedObject.stringValue)).toBe(false);
                expect(isFunction(promisifiedObject.functionValue)).toBe(true);

                // Execute the function
                let result = promisifiedObject.functionValue(()=>{});
                // Ducktype for Promise
                expect(result.then).toBeDefined();
                expect(result.catch).toBeDefined();

                // Return the promise chain
                return result.catch(fail);
            });

            describe('Options', () => {

                it('should not promiseify excluded names', () => {
                    let someObject = {
                        toExclude: () => {return {name: 'toExclude'}},
                        toPromiseify: () => {return {name: 'toPromise'}}
                    };

                    let promiseifiedObject = Promiseify(someObject, {exclude: ['toExclude']});
                    expect(promiseifiedObject.toPromiseify().then).toEqual(expect.any(Function));
                    expect(promiseifiedObject.toExclude().then).not.toBeDefined();
                });

                it('should promiseify only specified names', () => {
                    let someObject = {
                        toOnly: () => {return {name: 'toOnly'}},
                        toInclude: () => {return {name: 'toInclude'}},
                        toExclude: () => {return {name: 'toExclude'}}
                    };

                    let promiseifiedObject = Promiseify(someObject, {only: ['toOnly']});
                    expect(promiseifiedObject.toOnly().then).toEqual(expect.any(Function));
                    expect(promiseifiedObject.toInclude().then).not.toBeDefined();
                    expect(promiseifiedObject.toExclude().then).not.toBeDefined();
                });

                it('should promiseify only specified names and ignore "exclude"', () => {
                    let someObject = {
                        toOnly: () => {return {name: 'toOnly'}},
                        toInclude: () => {return {name: 'toInclude'}},
                        toExclude: () => {return {name: 'toExclude'}}
                    };

                    let promiseifiedObject = Promiseify(someObject, {only: ['toOnly'], exclude: ['toOnly']});
                    expect(promiseifiedObject.toOnly().then).toEqual(expect.any(Function));
                    expect(promiseifiedObject.toInclude().then).not.toBeDefined();
                    expect(promiseifiedObject.toExclude().then).not.toBeDefined();
                });

                it('should promiseify only specified names and ignore "include"', () => {
                    let someObject = {
                        toOnly: () => {return {name: 'toOnly'}},
                        toInclude: () => {return {name: 'toInclude'}},
                        toExclude: () => {return {name: 'toExclude'}}
                    };

                    let promiseifiedObject = Promiseify(someObject, {only: ['toOnly'], include: ['toInclude']});
                    expect(promiseifiedObject.toOnly().then).toEqual(expect.any(Function));
                    expect(promiseifiedObject.toInclude().then).not.toBeDefined();
                    expect(promiseifiedObject.toExclude().then).not.toBeDefined();
                });

                it('should promiseify included names while excluding specified names', () => {
                    let someObject = {
                        toInclude: () => {return {name: 'toInclude'}},
                        toExclude: () => {return {name: 'toExclude'}}
                    };

                    let promiseifiedObject = Promiseify(someObject, {include: ['toInclude', 'toExclude'], exclude: ['toExclude']});
                    expect(promiseifiedObject.toInclude().then).toEqual(expect.any(Function));
                    expect(promiseifiedObject.toExclude().then).not.toEqual(expect.any(Function));
                });

                it('should not promiseify included names that do not exist', () => {
                    let someObject = {
                        toInclude: () => {return {name: 'toInclude'}},
                        toExclude: () => {return {name: 'toExclude'}}
                    };

                    let promiseifiedObject = Promiseify(someObject, {include: ['toInclude'], exclude: ['toExclude']});
                    expect(promiseifiedObject.toInclude().then).toEqual(expect.any(Function));
                    expect(promiseifiedObject.toExclude().then).not.toEqual(expect.any(Function));
                    expect(promiseifiedObject.toIncludes).not.toBeDefined();
                });

                describe('ES6 Classes', () => {

                    it('should include all names', () => {
                        let someObject = new SuperClass();
                        let promisifiedObject = Promiseify(someObject);
                        expect(promisifiedObject.functionOne().then).toEqual(expect.any(Function));
                        expect(promisifiedObject.functionTwo().then).toEqual(expect.any(Function));
                    });

                    it('should only promiseify specified functions', () => {
                        let someObject = new SuperClass();
                        let promisifiedObject = Promiseify(someObject, {only: ['functionOne']});
                        expect(promisifiedObject.functionOne().then).toEqual(expect.any(Function));
                        expect(promisifiedObject.functionTwo().then).not.toBeDefined();
                    });

                    it('should include only specified functions', () => {
                        let someObject = new SuperClass();
                        let promisifiedObject = Promiseify(someObject, {include: ['functionOne']});
                        expect(promisifiedObject.functionOne().then).toEqual(expect.any(Function));
                        expect(promisifiedObject.functionTwo().then).not.toBeDefined();
                    });

                    it('should exclude specified functions', () => {
                        let someObject = new SuperClass();
                        let promisifiedObject = Promiseify(someObject, {exclude: ['functionTwo']});
                        expect(promisifiedObject.functionOne().then).toEqual(expect.any(Function));
                        expect(promisifiedObject.functionTwo().then).not.toBeDefined();
                    });

                    it('should exclude specified functions which have been included', () => {
                        let someObject = new SuperClass();
                        let promisifiedObject = Promiseify(someObject, {include: ['functionOne', 'functionTwo'], exclude: ['functionTwo']});
                        expect(promisifiedObject.functionOne().then).toEqual(expect.any(Function));
                        expect(promisifiedObject.functionTwo().then).not.toBeDefined();
                    });

                    it('should include sub class and super class names', () => {
                        let someObject = new SubClass();
                        let promisifiedObject = Promiseify(someObject);
                        expect(promisifiedObject.functionOne().then).toEqual(expect.any(Function));
                        expect(promisifiedObject.functionTwo().then).toEqual(expect.any(Function));
                        expect(promisifiedObject.functionThree().then).toEqual(expect.any(Function));
                    });

                });

                describe('outcomeRedirector', () => {

                    describe('successCallback', () => {

                        let invokeSuccess = (successCallback, errorCallback) => {
                            successCallback();
                        }

                        let invokeFailure = (successCallback, errorCallback) => {
                            successCallback('error');
                        }

                        it('should allow the outcomeRedirector to modify the outcome by converting a successful outcome to a failure when the success callback is passed a parameter', () => {

                            // If there is no value, return true; if there is a value, return false
                            let outcomeRedirector = val => !val;

                            let invokeSuccessPromiseified = Promiseify(invokeSuccess, {
                                outcomeRedirector: outcomeRedirector
                            });

                            let invokeFailurePromiseified = Promiseify(invokeFailure, {
                                outcomeRedirector: outcomeRedirector
                            });

                            return Promise.resolve()
                                .then(() => invokeSuccessPromiseified())
                                // 'catch' should not be invoked!
                                .catch(() => Promise.reject())
                                .then(() => invokeFailurePromiseified())
                                // 'then' should not be invoked
                                .then(() => Promise.reject())
                                .catch(() => {});

                        });

                        it('should allow the outcomeRedirector to modify the outcome by converting a failure outcome to a success', () => {

                            // If there is a value, return true; if there is no value, return false
                            let outcomeRedirector = val => !!val;

                            let invokeSuccessPromiseified = Promiseify(invokeSuccess, {
                                outcomeRedirector: outcomeRedirector
                            });

                            let invokeFailurePromiseified = Promiseify(invokeFailure, {
                                outcomeRedirector: outcomeRedirector
                            });

                            return Promise.resolve()
                                .then(() => invokeSuccessPromiseified())
                                // 'then' should not be invoked
                                .then(() => Promise.reject())
                                .catch(() => {})
                                .then(() => invokeFailurePromiseified())
                                // 'catch' should not be invoked
                                .catch(() => Promise.reject());

                        });

                    });

                    describe('failureCallback', () => {

                        let invokeSuccess = (successCallback, errorCallback) => {
                            errorCallback();
                        }

                        let invokeFailure = (successCallback, errorCallback) => {
                            errorCallback('error');
                        }

                        it('should allow the outcomeRedirector to modify the outcome by converting a successful outcome to a failure when the success callback is passed a parameter', () => {

                            // If there is no value, return true; if there is a value, return false
                            let outcomeRedirector = val => {
                                return !val;
                            }
                            let invokeSuccessPromiseified = Promiseify(invokeSuccess, {
                                outcomeRedirector: outcomeRedirector
                            });

                            let invokeFailurePromiseified = Promiseify(invokeFailure, {
                                outcomeRedirector: outcomeRedirector
                            });

                            return Promise.resolve()
                                .then(() => invokeSuccessPromiseified())
                                // 'catch' should not be invoked
                                .catch(() => Promise.reject())
                                .then(() => invokeFailurePromiseified())
                                 // 'then' should not be invoked
                                .then(() => Promise.reject())
                                .catch(() => {});
                        });

                        it('should allow the outcomeRedirector to modify the outcome by converting a failure outcome to a success', () => {

                            // If there is a value, return true; if there is no value, return false
                            let outcomeRedirector = val => !!val;

                            let invokeSuccessPromiseified = Promiseify(invokeSuccess, {
                                outcomeRedirector: outcomeRedirector
                            });

                            let invokeFailurePromiseified = Promiseify(invokeFailure, {
                                outcomeRedirector: outcomeRedirector
                            });

                            return Promise.resolve()
                                .then(() => invokeSuccessPromiseified())
                                // 'then' should not be invoked
                                .then(() => Promise.reject())
                                .catch(() => {})
                                .then(() => invokeFailurePromiseified())
                                // 'catch' should not be invoked
                                .catch(() => Promise.reject());

                        });

                    });

                });

            });

        });

    });

}
