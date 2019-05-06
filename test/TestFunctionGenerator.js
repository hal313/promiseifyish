/**
 * Creates a test function which executes (async or sync) and executes the appropriate callback,
 * based on success. A descriptor is returned which contains all the runtime information of the
 * created function, useful for testing.
 *
 * The descriptor contains a member named 'execute', which is a no-arg innvocation of the created
 * function, which returns a promise that resolves to the descriptor once the created function
 * finishes execution. This is helpful for testing.
 *
 * <tt>
 *   createTestFunctionDescriptor(Promiseifyish, [1], ['two'], true, true).execute()
 *       .then(descriptor => {
 *           // Test descriptor expectations
 *       })
 *       .catch(error => console.error('execution error', error));
 * </tt>
 *
 * @param {Promiseifyish} Promiseifyish the Promiseifyish implementation to use
 * @param {*[]} functionArguments the arguments to pass to the function at execution time (not including the callbacks)
 * @param {*[]} callbackArguments the arguments to pass to the callbacks
 * @param {boolean} success true, if the function should invoke the success callback
 * @param {boolean} sync true, if the function should be synchronous
 * @param {Function} [successCallback] the success callback (a mock will be provided if not specified)
 * @param {Function} [failureCallback] the failure callback (a mock will be provided if not specified)
 * @param {Object} [functionContext] optional context passed to the generated function
 */
export function createTestFunctionDescriptor(Promiseifyish, functionArguments, callbackArguments, success, sync, successCallback, failureCallback, functionContext) {

    let Promiseify = Promiseifyish.Promiseify;
    let isFunction = Promiseifyish.isFunction;

    /**
     * A generated function which will invoke the callbacks as appropriate.
     *
     * @param {*} arguments based on what is passed in; will always be the functionArguments + 2 callbacks (added via the promiseify function)
     */
    let testFunction = jest.fn(function testFunctionMock() {
        // Get the callback (success callback is second to last argument, failure callbackis the last argument)
        let callbackToExecute = !!descriptor.success ? arguments[arguments.length-2] : arguments[arguments.length-1];
        descriptor.execution.promise = executeCallback(callbackToExecute, descriptor.arguments.callback);
    });

    /**
     * Executes the test function, passing in the function arguments and the success and
     * failure callbacks.
     *
     * @return {Promise} a promise which resolves to the function descriptor once the function finishes execution
     */
    function executeTestFunction() {
        if (!!descriptor.execution.timestamp) {
            // This function has been executed already!
            descriptor.execution.promise = Promise.reject('Test function can only be executed once!');
            return descriptor.execution.promise;
        }

        // Execute the test function
        //
        //
        let executedArguments;

        if (0 !== arguments.length) {
            // Arguments passed in - use those!
            executedArguments = Array.from(arguments);
        } else {
            // No arguments passed in; build some from the descriptor

            // Build the arguments
            //
            // Start with the passed in functionArguments
            executedArguments = Array.from(descriptor.arguments.testFunction);
            // Push the callbacks
            //
            if (!!descriptor.callbacks.success && !!descriptor.callbacks.failure) {
                // Success and failure
                executedArguments.push(descriptor.callbacks.success);
                executedArguments.push(descriptor.callbacks.failure);
            } else if (!!descriptor.callbacks.success && !descriptor.callbacks.failure) {
                // Success only
                executedArguments.push(descriptor.callbacks.success);
            } else if (!descriptor.callbacks.success && !!descriptor.callbacks.failure) {
                // Failure only
                executedArguments.push(undefined);
                executedArguments.push(descriptor.callbacks.failure);
            } else {
                // No callbacks
            }
        }


        // Set the arguments
        descriptor.execution.arguments = executedArguments;

        // Record the execution time
        descriptor.execution.timestamp = new Date();
        // Execute the function and record the result (should be a promise)
        descriptor.execution.result = descriptor.promiseifiedTestFunction.apply(descriptor.execution.context || {}, descriptor.execution.arguments)
        // Return the promise for convenience (chaining)
        return descriptor.execution.promise;
    };

    /**
     * Wraps a function as a mock.
     *
     * @param {Function} [fn] the function to wrap as a mock
     * @returns {Function} the wrapped function
     */
    function mockify(fn) {
        if (fn) {
            if (!!fn.mock) {
                return fn;
            }
            return jest.fn(fn);
        }
        return fn;
    }

    // The execution descriptor
    let descriptor = {
        // Function to execute the wrapped function
        execute: executeTestFunction,
        // The function itself (unrwapped)
        testFunction: testFunction,
        // The promisified function
        promiseifiedTestFunction: Promiseify(testFunction),
        execution: {
            context: functionContext,
            timestamp: null,
            arguments: null,
            result: null,
            promise: null
        },
        arguments: {
            testFunction: functionArguments || [],
            callback: callbackArguments || []
        },
        success: !!success,
        sync: !!sync,
        callbacks: {
            success: mockify(successCallback),
            failure: mockify(failureCallback)
        }
    };

    /**
     * Invokes a callback with the provided arguments.
     *
     * @param {Function} callback the callback to execute
     * @param {[]*} [args] the arguments with which to execute the callback
     * @returns {Promise} resolved with the execution descriptor (for chaining)
     */
    function executeCallback(callback, args) {
        return new Promise(resolve => {

            /**
             * Executes a callback. Invokes the callback (if present) and always
             * resolves the descriptor (or error).
             */
            function doExecuteCallback() {
                if (isFunction(callback)) {
                    try {
                        callback.apply({}, args);
                    } catch (error) {
                        // The callback invocation failed; do nothing
                    };
                }

                // Resolve the descriptor
                resolve(descriptor);
            }

            if (!!sync) {
                doExecuteCallback();
            } else {
                setTimeout(doExecuteCallback);
            }
        });
    }

    return descriptor;
}
