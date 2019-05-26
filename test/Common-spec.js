let runner = require('./CommonRunner.js');

[
    require('../src/Promiseifyish.js'),
    require('../dist/Promiseifyish.js'),
    require('../dist/Promiseifyish.min.js')
].forEach(runner.run);