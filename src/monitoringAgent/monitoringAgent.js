import Service from "../contracts/Service.json";
import Web3 from 'web3';

const contract = require('truffle-contract');
const addressService = "0xf2beae25b23f0ccdd234410354cb42d08ed54981";
const providerAddress = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
const customerAddress = "0xf17f52151ebef6c7334fad080c5704d77216b732";

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

let monitoringData = [99];
let hash = web3.utils.soliditySha3({t: 'address', v: addressService}, {t: 'uint[]', v: monitoringData});
let customer = {
    v: 0,
    r: 0,
    s: 0,
    address: customerAddress,
};
let provider = {
    v: 0,
    r: 0,
    s: 0,
    address: providerAddress,
};

ServiceContract.at(addressService).then(instance => {
    console.log("Connected to contract: " + instance.address);
    let ServiceInstance = instance;
    setInterval(async () => {
        monitoringData = [Math.floor(Math.random() * 101)];
        hash = web3.utils.soliditySha3({t: 'address', v: addressService}, {t: 'uint[]', v: monitoringData});

        let sig1 = await web3.eth.sign(hash, provider.address);
        let sig2 = await web3.eth.sign(hash, customer.address);
        let sigP = sig1.slice(2);
        provider.r = `0x${sigP.slice(0, 64)}`;
        provider.s = `0x${sigP.slice(64, 128)}`;
        provider.v = web3.utils.toDecimal(sigP.slice(128, 130)) + 27;
        let sigC = sig2.slice(2);
        customer.r = `0x${sigC.slice(0, 64)}`;
        customer.s = `0x${sigC.slice(64, 128)}`;
        customer.v = web3.utils.toDecimal(sigC.slice(128, 130)) + 27;

        console.log("Adding new service peformance data: " + monitoringData);
        console.log(ServiceInstance);
        // add performance data once (for provider)
        await ServiceInstance.addAvailabilityData.estimateGas(hash, provider.v,
            provider.r, provider.s, monitoringData, {from: providerAddress})
            .catch(error => {
                console.log("ERROR in estimating gas for addAvailabilityData");
                console.log(error);
            }).then(gasEstimate =>
                ServiceInstance.addAvailabilityData(hash, provider.v,
                    provider.r, provider.s, monitoringData, {from: providerAddress, gas: 2 * gasEstimate})
                    .catch(error => {
                        console.log("ERROR in addAvailabilityData transaction!");
                        console.log(error);
                    })
                    .then(txResult => {
                        console.log("Successfully added monitoring data to contract.");
                        console.log(txResult);
                    })
            );

        // add performance data a second time (for customer)
        await ServiceInstance.addAvailabilityData.estimateGas(hash, customer.v,
            customer.r, customer.s, monitoringData, {from: customerAddress})
            .catch(error => {
                console.log("ERROR in estimating gas for addAvailabilityData");
                console.log(error);
            }).then(gasEstimate =>
                ServiceInstance.addAvailabilityData(hash, customer.v,
                    customer.r, customer.s, monitoringData, {from: customerAddress, gas: 2 * gasEstimate})
                    .catch(error => {
                        console.log("ERROR in addAvailabilityData transaction!");
                        console.log(error);
                    })
                    .then(txResult => {
                        console.log("Successfully added monitoring data to contract.");
                        console.log(txResult);
                    })
            );

    }, 86400000)
});



