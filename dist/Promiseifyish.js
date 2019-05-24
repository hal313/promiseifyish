(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Promiseifyish = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getType = getType;
  _exports.isFunction = isFunction;
  _exports.isObject = isObject;
  _exports.execute = execute;
  _exports.getAllFunctionNames = getAllFunctionNames;
  _exports.Promiseify = Promiseify;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
   * Gets the type of an object.
   *
   * This is a huge hack because Babel seems to have issues with typeof in some cases.
   *
   * @param {*} the thing to get the type of
   * @returns {string} a string which defines the type
   */
  function getType(o) {
    return _typeof(o);
  }
  /**
   * Tests to see if a candidate is a function.
   *
   * @param {*} candidate the candidate to test
   * @returns {boolean} true if candidate is a function; false otherwise
   */


  function isFunction(candidate) {
    // TODO: Test this
    return 'function' === getType(candidate) || candidate instanceof Function;
  }

  ;
  /**
   * Tests to see if a candidate is an object.
   *
   * @param {*} candidate the candidate to test
   * @returns {boolean} true if candidate is an object; false otherwise
   */

  function isObject(candidate) {
    return 'object' === getType(candidate);
  }
  /**
   * Executes a function with the specified parameters and context.
   *
   * @param {Function} fn the function to execute
   * @param {[*]} [args] the arguments
   * @param {object} [context] the context to run the function with
   */


  function execute(fn, args, context) {
    if (isFunction(fn)) {
      return fn.apply(context || {}, args);
    }

    return null;
  } // Names of functions defined by Object


  var OBJECT_PROTOTYPE_FUNCTION_NAMES = Object.getOwnPropertyNames(Object.getPrototypeOf(new Object()));
  /**
   * Gets the names of all functions (other than functions defined on Object), defined and inherited.
   *
   * @param {Object} target the object to get all function names from, defined in inherited
   * @returns {String[]} names of defined functions
   */

  function getAllFunctionNames(target) {
    var functionNames = [];

    if (!!target && isObject(target)) {
      do {
        Object.getOwnPropertyNames(target).filter(function (name) {
          return !!target[name];
        }).filter(function (name) {
          return isFunction(target[name]);
        }).filter(function (name) {
          return !OBJECT_PROTOTYPE_FUNCTION_NAMES.includes(name);
        }).filter(function (name) {
          return !functionNames.includes(name);
        }).forEach(function (name) {
          return functionNames.push(name);
        });
      } while (target = Object.getPrototypeOf(target));
    }

    return functionNames.sort();
  }
  /**
   * Promiseifies a function or every function on a target. If the target is an object, all functions will be promiseified.
   *
   * @param {Function|Object} target the function or object to promiseify
   * @param {Object} options the options for promiseification
   * @returns {Function|Object} the promiseified target
   */


  function Promiseify(target, options) {
    if (isFunction(target)) {
      return function () {
        // if arguments.length = 0
        //  no success handler
        // if arguments.length = 1
        //  if (args[0]) is a function
        //    assume success handler
        //  else
        //    no success handler
        // if right-most is a function AND (right-most - 1) is also a function
        //  assume success and error
        // if right-most is a function AND (right-most - 1) is not a function
        //  assume only success
        // else
        //  no handlers
        // Handlers (no-op, by default)
        var successHandler;
        var failureHandler; // Args for the function execution; this will not include callbacks after processing

        var executionArguments = Array.from(arguments); // Separate the arguments from the callbacks:
        //   -executionArguments will be the pure arguments
        //   -successHandler will be a wrapped handler
        //   -failureHandler will be a wrapped handler

        if (0 === arguments.length) {// No handlers passed in; no need to change handlers or args
        }

        if (1 === arguments.length) {
          // Evaluate the sole argument
          //
          if (isFunction(arguments[0])) {
            // If one arg is passed in and it is a function, consider it a success function
            //
            // Assign the success handler
            successHandler = arguments[0]; // Remove any arguments

            executionArguments = [];
          } else {// No success handler; no need to change handlers or args
          }
        } else {
          // More than 1 arguments are passed in
          //
          if (isFunction(arguments[arguments.length - 1]) && isFunction(arguments[arguments.length - 2])) {
            // If both of the last two arguments are functions,
            //  -assign the success and failure handlers
            successHandler = arguments[arguments.length - 2];
            failureHandler = arguments[arguments.length - 1]; //
            //  -remove the last two arguments from args

            executionArguments = executionArguments.slice(0, executionArguments.length - 2);
          } else if (isFunction(arguments[arguments.length - 1])) {
            // If only the last argument is a function,
            //  -assign the success handler only
            successHandler = arguments[arguments.length - 1]; //
            //  -remove the last argument from args

            executionArguments = executionArguments.slice(0, executionArguments.length - 1);
          } else {// No callbacks passed in; no need to change args or callbacks
          }
        } // Return a promise
        //
        // It is the responsibility of the function implementation to invoke the callbacks!


        return new Promise(function (resolve, reject) {
          // Push the success handler onto args
          executionArguments.push(function onSuccessPromiseified() {
            // Get the arguments
            var executitionArgs = Array.from(arguments);
            execute(successHandler, executitionArgs);
            resolve(executitionArgs);
          }); // Push the failure handler onto args

          executionArguments.push(function onErrorPromiseified() {
            var executitionArgs = Array.from(arguments);
            execute(failureHandler, executitionArgs);
            reject(executitionArgs);
          }); // Execute the function (throwing will reject the promise with the error)

          target.apply({}, executionArguments);
        });
      };
    } else if (isObject(target)) {
      var promisifiedObject = target;
      var targetFunctions = getAllFunctionNames(target); // Conditional promiseifying

      var localOptions = options || {};

      if (!!localOptions.only) {
        targetFunctions = localOptions.only;
      } else {
        if (!!localOptions.include) {
          // Start from a blank slate
          targetFunctions = [];
          localOptions.include.forEach(function (name) {
            if (!targetFunctions.includes(name) && isFunction(promisifiedObject[name])) {
              targetFunctions.push(name);
            }
          });
        }

        if (!!localOptions.exclude) {
          localOptions.exclude.forEach(function (name) {
            targetFunctions = targetFunctions.filter(function (candidate) {
              return candidate !== name;
            });
          });
        }
      } // Promiseify the functions


      targetFunctions.forEach(function (name) {
        if (isFunction(promisifiedObject[name])) {
          promisifiedObject[name] = Promiseify(promisifiedObject[name]);
        }
      });
      return promisifiedObject;
    } else {
      throw 'Cannot promiseify type: ' + getType(target);
    }
  }
});