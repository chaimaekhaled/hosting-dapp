let Provider = artifacts.require("./Provider.sol");
//let Service = artifacts.require("./ServiceContract.sol");

module.exports = function (deployer) {
    deployer.deploy(Provider);
    //deployer.deploy(ServiceContract);
};