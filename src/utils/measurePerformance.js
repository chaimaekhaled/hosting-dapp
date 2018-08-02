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
    let monitoringAgent = accounts[2];
    let gasLimit = 4500000;

    let provider = {
        address: accounts[0],
        v: null,
        r: null,
        s: null,
    };

    let customer = {
        address: accounts[1],
        v: null,
        r: null,
        s: null,
    };

    let gasUsedProviderDeploy = 0;
    let gasUsedAddServiceOffering = 0;
    let gasUsedOrderAService = 0;
    let gasUsedAddMonitoringData = 0;
    let gasUsedExtendContract = 0;
    let gasUsedShortenContract = 0;

    let providerContract = new web3.eth.Contract(Provider.abi, {from: provider.address, gasLimit: 4500000});
    let serviceContract = new web3.eth.Contract(Service.abi);

    let hash;
    const monitoringData = [55, 99, 80];

    // Deploy contract
    await providerContract.deploy({data: Provider.bytecode})
        .send({from: provider.address, gas: gasLimit})
        .on('receipt', (receipt) => {
            //console.log(receipt.cumulativeGasUsed);
            gasUsedProviderDeploy += receipt.cumulativeGasUsed;
            // return gasUsedProviderDeploy;
        })
        .then(newContractInstance => providerContract = newContractInstance);
    // Set name
    await providerContract.methods.setName("testName").send({from: provider.address})
        .on("receipt", (receipt) => {
            gasUsedProviderDeploy += receipt.cumulativeGasUsed;
            console.log(web3.version);
            // return gasUsedProviderDeploy;
        }).catch(error => console.log(error));
    // Set monitoringAgent
    await providerContract.methods.setMonitoringAgent(monitoringAgent).send({from: provider.address})
        .on("receipt", (receipt) => {
            gasUsedProviderDeploy += receipt.cumulativeGasUsed;
            // return gasUsedProviderDeploy;
        });
    console.log("Gas consumed for deploying provider contract: " + gasUsedProviderDeploy);

    // 2) Add a service offering
    await providerContract.methods.addProduct(
        "productName", 12, [1, 2, 3, 4], [0, 95, 75, 15, 50]).send({from: provider.address}
    ).on("receipt", (receipt) => {
        gasUsedAddServiceOffering += receipt.cumulativeGasUsed;
        // return gasUsedAddServiceOffering;
    });
    console.log("Gas consumed for adding a service offering: " + gasUsedAddServiceOffering);

    // 3) Order a service
    await providerContract.methods.buyService(0, "myPubKey")
        .send({from: customer.address, value: 120})
        .on("receipt", (receipt) => {
                gasUsedOrderAService += receipt.cumulativeGasUsed;
                const createdServiceContractAddress = receipt.events.NewProductBought.returnValues[0];
                serviceContract.options.address = createdServiceContractAddress;
                serviceContract = new web3.eth.Contract(Service.abi, createdServiceContractAddress);
                // return gasUsedOrderAService;
            }
        );
    console.log("Gas consumed for buying a service: " + gasUsedOrderAService);

    // 4) Add Monitoring data (execute 2 times - once for provider & once for customer to 'close' state channel)
    // Method to sign the hash message with an account and retrieve v, r, s
    const signHash = async (hash, account) => {
        await web3.eth.sign(hash, account.address).then((signedHash) => {
            account.r = signedHash.slice(0, 66);
            account.s = '0x' + signedHash.slice(66, 130);
            let v = web3.utils.hexToNumber('0x' + signedHash.slice(130, 132));
            if (v < 2) v = v + 27;
            account.v = v;
        });
        return account
    };

    hash = await web3.utils.soliditySha3(
        {t: 'address', v: serviceContract.options.address},
        {t: 'uint[]', v: monitoringData}
    );
    provider = await signHash(hash, provider);
    customer = await signHash(hash, customer);
    // console.log(await serviceContract.methods.getStartDate().call().then(res => res));
    // console.log(await serviceContract.methods.getEndDate().call().then(res => res));
    // fake startDate for this test
    const newStartDate = await serviceContract.methods.getStartDate().call().then(res => {
        return (new Date(res * 1000 - 3 * 86400000)) / 1000;
    });
    const newEndDate = await serviceContract.methods.getEndDate().call().then(res => {
        return (new Date(res * 1000 - 3 * 86400000)) / 1000;
    });
    await serviceContract.methods.setMockData(newEndDate, [], newStartDate, newStartDate).send({from: provider.address})
        .catch(error => {
            console.log("Error in setMockData");
            console.log(error);
        });


    // Add data once to service contract
    await serviceContract.methods.addAvailabilityData(hash, provider.v, provider.r, provider.s, monitoringData)
        .send({from: provider.address})
        .on("receipt", (receipt) => {
            gasUsedAddMonitoringData += receipt.cumulativeGasUsed;
            // return gasUsedAddMonitoringData;
        })
        .catch(error => {
            console.log("Error in addAvailabilityData 1");
            console.log(error);
        });

    // Add data a second time to 'close' the state channel
    const gasEstimate = await serviceContract.methods.addAvailabilityData(hash, customer.v, customer.r, customer.s, monitoringData)
        .estimateGas({from: customer.address}).then(res => res);

    await serviceContract.methods.addAvailabilityData(hash, customer.v, customer.r, customer.s, monitoringData)
        .send({from: customer.address, gas: gasEstimate * 1.5})
        .on("receipt", (receipt) => {
            gasUsedAddMonitoringData += receipt.cumulativeGasUsed;
            // return gasUsedAddMonitoringData;
        })
        .catch(error => {
            console.log("Error in addAvailabilityData 2");
            console.log(error);
        });

    console.log("Gas consumed for payment of service: " + gasUsedAddMonitoringData);

    // 5) Extend the contract
    await serviceContract.methods.changeContractDuration(10).send({from: customer.address, value: 120})
        .on("receipt", (receipt) => {
            gasUsedExtendContract += receipt.cumulativeGasUsed;
            // return gasUsedExtendContract;
        }).catch(error => {
            console.log("Error in changeContractDuration");
            console.log(error);
        });
    console.log("Gas consumed for extending contract: " + gasUsedExtendContract);

    // 6) Shorten the contract
    await serviceContract.methods.changeContractDuration(-10).send({from: customer.address})
        .on("receipt", (receipt) => {
            gasUsedShortenContract += receipt.cumulativeGasUsed;
            // return gasUsedShortenContract;
        });
    console.log("Gas consumed for shortening contract: " + gasUsedShortenContract);

});
