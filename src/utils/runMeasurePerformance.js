require('babel-register')({
    presets: [["env", { "targets": { "node": "current" } }]]
});

module.exports = require('./measurePerformance');

/*
    run this file with node.js to measure the performance of this application. The underlying functions are in the
     measurePerformance.js file.
 */