/**
 * A sample class with functions, used for testing.
 */
export class SuperClass {

    /**
     * Sample function for testing.
     *
     * @returns {String} a string
     */
    functionOne() {
        return 'functionOne';
    }

    /**
     * Sample function for testing.
     *
     * @returns {String} a string
     */
    functionTwo() {
        return 'functionTwo';
    }

}

/**
 * A sample class with functions, used for testing.
 */
export class SubClass extends SuperClass {

    /**
     * Sample function for testing.
     *
     * @returns {String} a string
     */
    functionThree() {
        return 'functionThree';
    }

}