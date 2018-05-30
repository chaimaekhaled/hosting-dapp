var Provider = artifacts.require("./Provider.sol");
//var ServiceContract = artifacts.require("./ServiceContract.sol");

module.exports = function (deployer) {
    deployer.deploy(Provider);
    //deployer.deploy(ServiceContract);
};