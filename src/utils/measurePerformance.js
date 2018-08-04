// Import contracts and web3
import Provider from "../contracts/Provider.json";
import Service from "../contracts/Service.json";
import {details2array} from "./helpers";
import Data from "./Data.json";
import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
// const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));

// const contract = require('truffle-contract');
// const ProviderContract = contract(Provider);
//
// ProviderContract.setProvider(web3.currentProvider);
// // Fix for http provider with truffle
// if (typeof ProviderContract.currentProvider.sendAsync !== "function") {
//     ProviderContract.currentProvider.sendAsync = function () {
//         return ProviderContract.currentProvider.send.apply(
//             ProviderContract.currentProvider, arguments
//         );
//     };
// }
// const ServiceContract = contract(Service);
// ServiceContract.setProvider(web3.currentProvider);
// // Fix for http provider with truffle
// if (typeof ServiceContract.currentProvider.sendAsync !== "function") {
//     ServiceContract.currentProvider.sendAsync = function () {
//         return ServiceContract.currentProvider.send.apply(
//             ServiceContract.currentProvider, arguments
//         );
//     };
// }
web3.eth.getAccounts().then(async (error, accounts) => {
    // Blockchain parameters
    const gasCost = 3500000000;

    // Define accounts
    let provider = {
        address: accounts[0],
        v: null,
        r: null,
        s: null,
        password: "asdf1",
    };

    let customer = {
        address: accounts[1],
        v: null,
        r: null,
        s: null,
        password: "asdf2",
    };
    let monitoringAgent = accounts[2];


    console.log("Provider: " + provider.address + " | Balance: " + web3.utils.fromWei("" + await web3.eth.getBalance(provider.address)));
    console.log("Customer: " + customer.address + " | Balance: " + web3.utils.fromWei("" + await web3.eth.getBalance(customer.address)));

    // Variables for storing measurement results
    let ProviderDeploy = {
        gasUsed: 0,
        timeTaken: 0,
        ethCost: 0,
        receipt: [],
    };
    let AddServiceOffering = {
        gasUsed: 0,
        timeTaken: 0,
        ethCost: 0,
        receipt: [],
    };
    let OrderAService = {
        gasUsed: 0,
        timeTaken: 0,
        ethCost: 0,
        receipt: [],
    };
    let AddMonitoringData = {
        gasUsed: 0,
        timeTaken: 0,
        ethCost: 0,
        receipt: [],
    };
    let ExtendContract = {
        gasUsed: 0,
        timeTaken: 0,
        ethCost: 0,
        receipt: [],
    };
    let ShortenContract = {
        gasUsed: 0,
        timeTaken: 0,
        ethCost: 0,
        receipt: [],
    };


    // Smart Contracts
    let providerContract = new web3.eth.Contract(Provider.abi, {from: provider.address, gasLimit: 4500000});
    let serviceContract = new web3.eth.Contract(Service.abi);

    // Variables for state channel
    let hash;
    const monitoringData = [55, 99, 80];


    // 1) deployment of provider contract + set relevant information (name + monitoringAgent)
    // Deploy contract
    console.time("deployProviderContract");
    await providerContract.deploy({data: Provider.bytecode})
        .send({from: provider.address, gas: 4500000})
        .on('receipt', (receipt) => {
            ProviderDeploy.gasUsed += receipt.cumulativeGasUsed;
            ProviderDeploy.receipt.push(receipt);
        })
        .then(newContractInstance => providerContract = newContractInstance);

    // Set name
    await providerContract.methods.setName("testName").send({from: provider.address})
        .on("receipt", (receipt) => {
            ProviderDeploy.gasUsed += receipt.cumulativeGasUsed;
            ProviderDeploy.receipt.push(receipt);
        }).catch(error => console.log(error));

    // Set monitoringAgent
    await providerContract.methods.setMonitoringAgent(monitoringAgent).send({from: provider.address})
        .on("receipt", (receipt) => {
            ProviderDeploy.gasUsed += receipt.cumulativeGasUsed;
            ProviderDeploy.receipt.push(receipt);
        });
    console.log("Gas consumed for deploying provider contract: " + ProviderDeploy.gasUsed);
    ProviderDeploy.timeTaken = console.timeEnd("deployProviderContract");
    ProviderDeploy.ethCost = ProviderDeploy.gasUsed * gasCost;
    console.log("Gas cost ProviderDeploy: " + web3.utils.fromWei("" + ProviderDeploy.ethCost));

    // 2) Add a service offering
    console.time("addServiceOffering");
    await providerContract.methods.addProduct(
        "productName", 12, [1, 2, 3, 4], [0, 95, 75, 15, 50]).send({from: provider.address}
    ).on("receipt", (receipt) => {
        AddServiceOffering.gasUsed += receipt.cumulativeGasUsed;
        AddServiceOffering.receipt.push(receipt);
    });
    console.log("Gas consumed for adding a service offering: " + AddServiceOffering.gasUsed);
    AddServiceOffering.timeTaken = console.timeEnd("addServiceOffering");
    AddServiceOffering.ethCost = AddServiceOffering.gasUsed * gasCost;
    console.log("Gas cost AddServiceOffering: " + web3.utils.fromWei("" + AddServiceOffering.ethCost));

    // providerContract.options.address = "0xadDc758baE34a6A372B3aB5FC2359E1E95084B64";

    // 3) Order a service
    console.time("orderService");
    await providerContract.methods.buyService(0, "myPubKey")
        .send({from: customer.address, value: 120})
        .on("receipt", (receipt) => {
                OrderAService.gasUsed += receipt.cumulativeGasUsed;
                OrderAService.receipt.push(receipt);
                const createdServiceContractAddress = receipt.events.NewProductBought.returnValues[0];
                serviceContract.options.address = createdServiceContractAddress;
                serviceContract = new web3.eth.Contract(Service.abi, createdServiceContractAddress);
                console.log("New serviceContract: " + createdServiceContractAddress);
            }
        );
    console.log("Gas consumed for buying a service: " + OrderAService.gasUsed);
    OrderAService.timeTaken = console.timeEnd("orderService");
    OrderAService.ethCost = OrderAService.gasUsed * gasCost;
    console.log("Gas cost OrderAService: " + web3.utils.fromWei("" + OrderAService.ethCost));

    // 4) Add Monitoring data (execute 2 times - once for provider & once for customer to 'close' state channel)
    // Method to sign the hash message with an account and retrieve v, r, s
    const signHash = async (hash, account) => {
        await web3.eth.personal.sign(hash, account.address, account.password).then((signedHash) => {
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
    const newStartDate = await serviceContract.methods.getStartDate().call({from: provider.address}).then(res => {
        return (new Date(res * 1000 - 3 * 86400000)) / 1000;
    });
    const newEndDate = await serviceContract.methods.getEndDate().call({from: provider.address}).then(res => {
        return (new Date(res * 1000 - 3 * 86400000)) / 1000;
    });
    await serviceContract.methods.setMockData(newEndDate, [], newStartDate, newStartDate).send({from: provider.address})
        .catch(error => {
            console.log("Error in setMockData");
            console.log(error);
        });

    console.time("addAvailabilityFirst");
    // Add data once to service contract
    await serviceContract.methods.addAvailabilityData(hash, provider.v, provider.r, provider.s, monitoringData)
        .send({from: provider.address})
        .on("receipt", (receipt) => {
            AddMonitoringData.gasUsed += receipt.cumulativeGasUsed;
            AddMonitoringData.receipt.push(receipt);
        })
        .catch(error => {
            console.log("Error in addAvailabilityData 1");
            console.log(error);
        });
    // return gasUsedAddMonitoringData;
    AddMonitoringData.timeTaken += console.timeEnd("addAvailabilityFirst");

    // Add data a second time to 'close' the state channel
    const gasEstimate = await serviceContract.methods.addAvailabilityData(hash, customer.v, customer.r, customer.s, monitoringData)
        .estimateGas({from: customer.address}).then(res => res);

    console.time("addAvailabilitySecond");
    await serviceContract.methods.addAvailabilityData(hash, customer.v, customer.r, customer.s, monitoringData)
        .send({from: customer.address, gas: gasEstimate * 1.5})
        .on("receipt", (receipt) => {
            AddMonitoringData.gasUsed += receipt.cumulativeGasUsed;
            AddMonitoringData.receipt.push(receipt);
        })
        .catch(error => {
            console.log("Error in addAvailabilityData 2");
            console.log(error);
        });

    console.log("Gas consumed for payment of service: " + AddMonitoringData.gasUsed);
    AddMonitoringData.timeTaken += console.timeEnd("addAvailabilitySecond");
    AddMonitoringData.ethCost = AddMonitoringData.gasUsed * gasCost;
    console.log("Gas cost AddMonitoringData: " + web3.utils.fromWei("" + AddMonitoringData.ethCost));

    // 5) Extend the contract
    console.time("extendContract");
    await serviceContract.methods.changeContractDuration(10).send({from: customer.address, value: 120})
        .on("receipt", (receipt) => {
            ExtendContract.gasUsed += receipt.cumulativeGasUsed;
            ExtendContract.receipt.push(receipt);
        }).catch(error => {
            console.log("Error in changeContractDuration");
            console.log(error);
        });
    console.log("Gas consumed for extending contract: " + ExtendContract.gasUsed);
    ExtendContract.timeTaken += console.timeEnd("extendContract");
    ExtendContract.ethCost = ExtendContract.gasUsed * gasCost;
    console.log("Gas cost ExtendContract: " + web3.utils.fromWei("" + ExtendContract.ethCost));

    // 6) Shorten the contract
    console.time("shortenContract");
    await serviceContract.methods.changeContractDuration(-10).send({from: customer.address})
        .on("receipt", (receipt) => {
            ShortenContract.gasUsed += receipt.cumulativeGasUsed;
            ShortenContract.receipt.push(receipt);
        });
    console.log("Gas consumed for shortening contract: " + ShortenContract.gasUsed);
    ShortenContract.timeTaken += console.timeEnd("shortenContract");
    ShortenContract.ethCost = ShortenContract.gasUsed * gasCost;
    console.log("Gas cost ShortenContract: " + web3.utils.fromWei("" + ShortenContract.ethCost));

    // Export results as json
    let db = {
        array: [],
    };
    db.array.push(provider);
    db.array.push(customer);
    db.array.push(ProviderDeploy);
    db.array.push(AddServiceOffering);
    db.array.push(OrderAService);
    db.array.push(AddMonitoringData);
    db.array.push(ExtendContract);
    db.array.push(ShortenContract);

    let json = JSON.stringify(db);
    let fs = require('fs');
    fs.writeFile(new Date().toISOString().split("T")[0] + '_performanceMeasurement.json', json, 'utf8', callback);

});
