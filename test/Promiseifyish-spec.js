// Get the runner
let runner = require('./PromiseifyishRunner.js');

// Test each file (source and all dist files)
[
    require('../src/Promiseifyish.js'),
    require('../dist/Promiseifyish.es6.js'),
    require('../dist/Promiseifyish.js'),
    require('../dist/Promiseifyish.min.js')
].forEach(runner.run);
