require('babel-register')({
    presets: [["env", {"targets": {"node": "current"}}]]
});

module.exports = require('./MockData');

/*
    run this file with node.js to set mock data for testing and demonstration purposes. The functions are in the
     MockData.js file. This expects an instance of the Provider smart contract deployed by truffle.
 */