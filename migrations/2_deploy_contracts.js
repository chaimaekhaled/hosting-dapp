let Provider = artifacts.require("./Provider.sol");
//let Service = artifacts.require("./ServiceDatabase.sol");

module.exports = function (deployer) {
    deployer.deploy(Provider);
    //deployer.deploy(ServiceContract);
};