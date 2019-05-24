import { SuperClass, SubClass } from './ClassDefinitions.js';

export function run(Promiseifyish) {

    const isFunction = Promiseifyish.isFunction;
    const getType = Promiseifyish.getType;
    const isObject = Promiseifyish.isObject;
    const execute = Promiseifyish.execute;
    const getAllFunctionNames = Promiseifyish.getAllFunctionNames;

    describe('isFunction', () => {

        it('should return true if a function is passed in', () => {
            expect(isFunction(()=>{})).toBe(true);
        });

        it('should return false when undefined is passed in', () => {
            expect(isFunction()).toBe(false);
            expect(isFunction(undefined)).toBe(false);
        });

        it('should return false when null is passed in', () => {
            expect(isFunction(null)).toBe(false);
        });

        it('should return false when a boolean is passed in', () => {
            expect(isFunction(true)).toBe(false);
            expect(isFunction(false)).toBe(false);
        });

        it('should return false when a number is passed in', () => {
            expect(isFunction(-1)).toBe(false);
            expect(isFunction(0)).toBe(false);
            expect(isFunction(1)).toBe(false);

            expect(isFunction(-0.1)).toBe(false);
            expect(isFunction(0.1)).toBe(false);

            expect(isFunction(Infinity)).toBe(false);
            expect(isFunction(-Infinity)).toBe(false);

            expect(isFunction(NaN)).toBe(false);
        });

        it('should return false when a string is passed in', () => {
            expect(isFunction('')).toBe(false);
            expect(isFunction('some string')).toBe(false);
        });

        it('should return false when an object is passed in', () => {
            expect(isFunction({})).toBe(false);
            expect(isFunction({name: 'value'})).toBe(false);
        });

    });

    describe('getType', () => {

        it('should return "function" if a function is passed in', () => {
            expect(getType(()=>{})).toBe('function');
        });

        it('should return "undefined" when undefined is passed in', () => {
            expect(getType()).toBe('undefined');
            expect(getType(undefined)).toBe('undefined');
        });

        it('should return "object" when null is passed in', () => {
            expect(getType(null)).toBe('object');
        });

        it('should return "boolean" when a boolean is passed in', () => {
            expect(getType(true)).toBe('boolean');
            expect(getType(false)).toBe('boolean');
        });

        it('should return "number" when a number is passed in', () => {
            expect(getType(-1)).toBe('number');
            expect(getType(0)).toBe('number');
            expect(getType(1)).toBe('number');

            expect(getType(-0.1)).toBe('number');
            expect(getType(0.1)).toBe('number');

            expect(getType(Infinity)).toBe('number');
            expect(getType(-Infinity)).toBe('number');

            expect(getType(NaN)).toBe('number');
        });

        it('should return "string" when a string is passed in', () => {
            expect(getType('')).toBe('string');
            expect(getType('some string')).toBe('string');
        });

        it('should return "object" when an object is passed in', () => {
            expect(getType({})).toBe('object');
            expect(getType({name: 'value'})).toBe('object');
        });

    });

    describe('isObject', () => {

        it('should return false if a function is passed in', () => {
            expect(isObject(()=>{})).toBe(false);
        });

        it('should return false when undefined is passed in', () => {
            expect(isObject()).toBe(false);
            expect(isObject(undefined)).toBe(false);
        });

        it('should return true when null is passed in', () => {
            expect(isObject(null)).toBe(true);
        });

        it('should return false when a boolean is passed in', () => {
            expect(isObject(true)).toBe(false);
            expect(isObject(false)).toBe(false);
        });

        it('should return false when a number is passed in', () => {
            expect(isObject(-1)).toBe(false);
            expect(isObject(0)).toBe(false);
            expect(isObject(1)).toBe(false);

            expect(isObject(-0.1)).toBe(false);
            expect(isObject(0.1)).toBe(false);

            expect(isObject(Infinity)).toBe(false);
            expect(isObject(-Infinity)).toBe(false);

            expect(isObject(NaN)).toBe(false);
        });

        it('should return false when a string is passed in', () => {
            expect(isObject('')).toBe(false);
            expect(isObject('some string')).toBe(false);
        });

        it('should return true when an object is passed in', () => {
            expect(isObject({})).toBe(true);
            expect(isObject({name: 'value'})).toBe(true);
        });

    });

    describe('execute', () => {

        it('should return null for undefined values', () => {
            expect(execute(undefined)).toBe(null);
        });

        it('should return null for null values', () => {
            expect(execute(null)).toBe(null);
        });

        it('should return null for boolean values', () => {
            expect(execute(true)).toBe(null);
            expect(execute(false)).toBe(null);
        });

        it('should return null for number values', () => {
            expect(execute(Number.NEGATIVE_INFINITY)).toBe(null);
            expect(execute(-10.01)).toBe(null);
            expect(execute(-1)).toBe(null);
            expect(execute(0)).toBe(null);
            expect(execute(1)).toBe(null);
            expect(execute(10.01)).toBe(null);
            expect(execute(Number.POSITIVE_INFINITY)).toBe(null);
        });

        it('should return null for string values', () => {
            expect(execute('')).toBe(null);
            expect(execute('someString')).toBe(null);
        });

        it('should return null for object values', () => {
            expect(execute({})).toBe(null);
        });

        it('should return the function return value for function values', () => {
            expect(execute(()=>3)).toBe(3);
        });

    });

    describe('getAllFunctionNames', () => {

        it('should return the empty array for undefined', () => {
            expect(getAllFunctionNames(undefined)).toEqual([]);
        });

        it('should return the empty array for null', () => {
            expect(getAllFunctionNames(null)).toEqual([]);
        });

        it('should return the empty array for boolean values', () => {
            expect(getAllFunctionNames(true)).toEqual([]);
            expect(getAllFunctionNames(false)).toEqual([]);
        });

        it('should return the empty array for number values', () => {
            expect(getAllFunctionNames(Number.NEGATIVE_INFINITY)).toEqual([]);
            expect(getAllFunctionNames(-10.00)).toEqual([]);
            expect(getAllFunctionNames(-1)).toEqual([]);
            expect(getAllFunctionNames(0)).toEqual([]);
            expect(getAllFunctionNames(1)).toEqual([]);
            expect(getAllFunctionNames(10.00)).toEqual([]);
            expect(getAllFunctionNames(Number.POSITIVE_INFINITY)).toEqual([]);
        });

        it('should return the empty array for strings', () => {
            expect(getAllFunctionNames('')).toEqual([]);
        });

        it('should return the functions on an object', () => {
            let someObject = {
                booleanValue: true,
                stringValue: 'stringValue',
                numberValue: 1,
                undefinedValue: undefined,
                nullValue: null,
                objectValue: {
                    subBooleanValue: true
                },
                functionValue01: () => {},
                functionValue02: () => {}
            };
            expect(getAllFunctionNames(someObject)).toEqual(['functionValue01', 'functionValue02'].sort());
        });

        it('should return the functions on an ES6 class', () => {
            expect(getAllFunctionNames(new SuperClass())).toEqual(['functionOne', 'functionTwo'].sort());
        });

        it('should return the functions on an ES6 sub class', () => {
            expect(getAllFunctionNames(new SubClass())).toEqual(['functionOne', 'functionTwo', 'functionThree'].sort());
        });

    });

};
