require('babel-register')({
    presets: [["env", {"targets": {"node": "current"}}]]
});

module.exports = require('./monitoringAgent');

/*
    Run this file with node.js. It is the simulated monitoring agent that sends a random number as service
     performance data every 24 hours to predefined smart contract in the name of the provider and customer.
     Fixed addresses can be changed in monitoringAgent.js .
 */