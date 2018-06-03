import Service from "../contracts/Service.json";
import Web3 from 'web3';

const contract = require('truffle-contract');
const addressService = "0xf2beae25b23f0ccdd234410354cb42d08ed54981";
const providerAddress = "0x627306090abab3a6e1400e9345bc60c78a8bef57";

const ServiceContract = contract(Service);
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
ServiceContract.setProvider(web3.currentProvider);
// Fix for http provider with truffle
if (typeof ServiceContract.currentProvider.sendAsync !== "function") {
    ServiceContract.currentProvider.sendAsync = function () {
        return ServiceContract.currentProvider.send.apply(
            ServiceContract.currentProvider, arguments
        );
    };
}
ServiceContract.at(addressService).then(instance => {
    setInterval(() => {
        console.log("Sending heartbeat to " + addressService);
        instance.heartbeat({from: providerAddress}).catch(error => console.log(error));
    }, 1000)
});

