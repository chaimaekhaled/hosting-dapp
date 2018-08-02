// Import contracts and web3
import Provider from "../contracts/Provider.json";
import Service from "../contracts/Service.json";
import {details2array} from "./helpers";
import Data from "./Data.json";
import Web3 from 'web3';

const contract = require('truffle-contract');
const ProviderContract = contract(Provider);
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
ProviderContract.setProvider(web3.currentProvider);
// Fix for http provider with truffle
if (typeof ProviderContract.currentProvider.sendAsync !== "function") {
    ProviderContract.currentProvider.sendAsync = function () {
        return ProviderContract.currentProvider.send.apply(
            ProviderContract.currentProvider, arguments
        );
    };
}
const ServiceContract = contract(Service);
ServiceContract.setProvider(web3.currentProvider);
// Fix for http provider with truffle
if (typeof ServiceContract.currentProvider.sendAsync !== "function") {
    ServiceContract.currentProvider.sendAsync = function () {
        return ServiceContract.currentProvider.send.apply(
            ServiceContract.currentProvider, arguments
        );
    };
}

web3.eth.getAccounts(async (error, accounts) => {

    // 1) deployment of provider contract + set relevant information (name + monitoringAgent)
    let providerAccount = accounts[0];
    let customerAccount = accounts[1];
    let monitoringAgent = accounts[2];
    let gasLimit = 4500000;

    let gasUsedProviderDeploy = 0;
    let gasUsedAddServiceOffering = 0;
    let gasUsedOrderAService = 0;
    let gasUsedAddMonitoringData = 0;
    let gasUsedExtendContract = 0;
    let gasUsedShortenContract = 0;

    let providerContract = new web3.eth.Contract(Provider.abi, {from: providerAccount, gasLimit: 4500000});
    let serviceContract;

    // Deploy contract
    await providerContract.deploy({data: Provider.bytecode})
        .send({from: providerAccount, gas: gasLimit})
        .on('receipt', (receipt) => {
            //console.log(receipt.cumulativeGasUsed);
            gasUsedProviderDeploy += receipt.cumulativeGasUsed;
            return gasUsedProviderDeploy;
        })
        .then(newContractInstance => providerContract = newContractInstance);
    // Set name
    await providerContract.methods.setName("testName").send({from: providerAccount})
        .on("receipt", (receipt) => {
            gasUsedProviderDeploy += receipt.cumulativeGasUsed;
            return gasUsedProviderDeploy;
        }).catch(error => console.log(error));
    // Set monitoringAgent
    await providerContract.methods.setMonitoringAgent(monitoringAgent).send({from: providerAccount})
        .on("receipt", (receipt) => {
            gasUsedProviderDeploy += receipt.cumulativeGasUsed;
            return gasUsedProviderDeploy;
        });
    console.log("Gas consumed for deploying provider contract: ");
    console.log(gasUsedProviderDeploy);

    // 2) Add a service offering
    await providerContract.methods.addProduct(
        "productName", 12, [1, 2, 3, 4], [0, 95, 75, 15, 50]).send({from: providerAccount}
    ).on("receipt", (receipt) => {
        gasUsedAddServiceOffering += receipt.cumulativeGasUsed;
        return gasUsedAddServiceOffering;
    });
    console.log("Gas consumed for adding a service offering: ");
    console.log(gasUsedAddServiceOffering);

    // 3) Order a service
    await providerContract.methods.buyService(
        0, "myPubKey").send({from: customerAccount, value: 120}
    ).on("receipt", (receipt) => {
            console.log(receipt);
            gasUsedOrderAService += receipt.cumulativeGasUsed;
            const createdServiceContractAddress = receipt.events.newProductBought.returnValues.serviceContract
            serviceContract = new web3.eth.Contract(Service.abi, createdServiceContractAddress);
            return gasUsedOrderAService;

        }
    );
    console.log("Gas consumed for buying a service: ");
    console.log(gasUsedOrderAService);

    // 4) Add Monitoring data (executed 2 times!)


    // 5) Extend the contract

    // 6) Shorten the contract


});
