let runner = require('./PromiseifyishRunner.js');

[
    require('../src/Promiseifyish.js'),
    require('../dist/Promiseifyish.js'),
    require('../dist/Promiseifyish.min.js')
].forEach(runner.run);
