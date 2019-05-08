export function run(Promiseifyish) {

    const isFunction = Promiseifyish.isFunction;
    const getType = Promiseifyish.getType;
    const isObject = Promiseifyish.isObject;

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

};
