import {isFunction, isObject} from './Common';
// import isObject from './Common';
// import getType from './Common';

export function Promiseify(fn) {

    if (isFunction(fn)) {
        return function() {
            // if arguments.length = 0
            //  no success handler
            // if arguments.length = 1
            //  if (args[0]) is function
            //    assume success handler
            //  else
            //    no success handler
            // if right-most is fn AND right-most-1 is fn
            //  assume success and error
            // if right-most is fn AND right-most-1 is not fn
            //  assume only success
            // else
            //  no handlers

            // Handlers (no-op, by default)
            let successHandler = () => {};
            let failureHandler = () => {};
            let hasHandlers = false;

            // Args for the function invocation
            let args = Array.from(arguments);

            if (0 === arguments.length) {
                // No handlers passed in; no need to change handlers or args
            } if (1 === arguments.length) {
                // Evaluate the sole argument
                //
                if (isFunction(arguments[0])) {
                    // If one arg is passed in and it is a function, consider it a success function
                    //
                    // Assign the success handler
                    successHandler = arguments[0];
                    hasHandlers = true;
                    // Remove any arguments
                    args = [];// args.slice(0, args.length-1);
                } else {
                    // Otherwise, there is no success function
                    // No success handler; no need to change handlers or args
                    // return Promise.reject('No callback passed in!');
                }
            } else {
                // More than 1 arguments are passed in!
                //
                if (isFunction(arguments[arguments.length-1]) && isFunction(arguments[arguments.length-2])) {
                    // If both of the last two arguments are functions,
                    //  -assign the success and failure handlers
                    successHandler = arguments[arguments.length-2];
                    failureHandler = arguments[arguments.length-1];
                    hasHandlers = true;
                    //  -remove the last two arguments from args
                    args = args.slice(0, args.length-2);
                } else if (isFunction(arguments[arguments.length-1])) {
                    // If only the last argument is a function,
                    //  -assign the success handler only
                    successHandler = arguments[arguments.length-1];
                    hasHandlers = true;
                    //  -remove the last argument from args
                    args = args.slice(0, args.length-1);
                }
            }

            if (hasHandlers) {
                // Return a promise
                return new Promise((resolve, reject) => {
                    // Push the success handler onto args
                    args.push(result => {
                        successHandler(result);
                        resolve(result);
                    });
                    // Push the failure handler onto args
                    args.push(error => {
                        failureHandler(error);
                        reject(error);
                    });

                    // Execute the function
                    fn.apply({}, args);
                });
            } else {
                try {
                    return Promise.resolve(fn.apply({}, args));
                } catch (error) {
                    return Promise.reject(error);
                }
            }
        }
    } else if (isObject(fn)) {
        let promisifiedObject = Object.assign({}, fn);
        Object.getOwnPropertyNames(promisifiedObject).forEach((name) => {
            if (isFunction(promisifiedObject[name])) {
                promisifiedObject[name] = Promiseify(promisifiedObject[name]);
            }
        });
        return promisifiedObject;
    } else {
        throw 'Cannot promisify type: ';// + getType(fn);
    }



}
