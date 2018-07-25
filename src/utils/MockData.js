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

// Flag if MockData should include buying products with accounts[1]
const buyProducts = true;

web3.eth.getAccounts((error, accounts) => {
    let providerAccount = accounts[0];
    let customerAccount = accounts[1];
    // let providerAccount = "0x516121B7f5893C637467A5402B7085FE946DEc37";
    // let customerAccount = "0xAD8Aa9bDcE3AB547434E522f3639884F745DB49d";
    let providerInstance;

    // ProviderContract.defaults({from: providerAccount});
    // ServiceContract.defaults({from: customerAccount});
    ProviderContract.deployed()
        .then((instance) => {
            // get name from contract
            providerInstance = instance;
            console.log("ProviderContract: " + instance.address);
            return providerInstance.name.call();
        })
        .then((name) => {
            // set name if necessary
            console.log("Provider's name in contract: " + name);
            console.log(Data.providerName);
            if (name !== Data.providerName) {
                console.log(".setting name: " + Data.providerName);
                return providerInstance.setName(Data.providerName, {from: providerAccount});
            }
            return null;
        })
        .then(() => {
            return providerInstance.countProducts.call();

        })
        .then((productsCount) => {
            console.log("Count of products: " + productsCount.c[0]);
            if (productsCount.c[0] === 0) {
                Data.products.forEach((product) => {
                    console.log("Adding product: " + product.name + " ID " + product.id);
                    providerInstance.addProduct.estimateGas(
                        product.name,
                        product.costPerDay,
                        details2array(product.details),
                        product.sla
                    ).then((gasEstimate) =>
                        providerInstance.addProduct(
                            product.name,
                            product.costPerDay,
                            details2array(product.details),
                            product.sla, {from: providerAccount, gas: 2 * gasEstimate})
                    ).catch(error => console.log(error));
                })
            }
            let products = providerInstance.countProducts.call();
            return products;

        })
        .then((countofProducts) => {
            /*if (countofProducts.c[0] === 0) {
                console.log("ERR: no products to buy, abort buying");
                return -1;
            }*/
            console.log("Count of products: " + countofProducts.c[0]);
            // check if customer already has contracts
            let pubKey = "myPubKey";
            let days = 86400;
            let today = ~~((new Date()).getTime() / 1000);
            let serviceStartDate = today - 6 * days;
            let serviceEndDate = today + 1 * days;
            //let customerContracts = await providerInstance.getAllContractsOfCustomer.call(customerAccount);
            // finished creating products for provider
            if (!buyProducts) return;

            // FLAG FOR BUYING PRODUCTS
            // instantiate serviceContracts to account[1] (customer)
            Data.serviceContracts.forEach((mockServiceContract) => {
                console.log("Trying to buy: ");
                console.log(mockServiceContract);
                let serviceContract = mockServiceContract;
                let serviceContractInstance = null;

                providerInstance.buyService.estimateGas(
                    serviceContract.productId,
                    pubKey,
                    {from: customerAccount, value: 7 * mockServiceContract.costPerDay}
                ).then(gasEstimate => providerInstance.buyService(
                    serviceContract.productId,
                    pubKey,
                    {from: customerAccount, gas: 2 * gasEstimate, value: 7 * mockServiceContract.costPerDay})
                ).catch(error => {
                    console.log("Error in tx buyService!");
                    console.log(error)
                }).then((txResultBuyService) => {
                    if (txResultBuyService !== undefined) {
                        console.log("MockServiceContract: ");
                        console.log("endDate: " + serviceEndDate);
                        console.log("availability: " + serviceContract.availability);
                        console.log("startDate: " + serviceStartDate);
                        let address = txResultBuyService.logs[1].args.serviceContract;
                        console.log("Service contract: " + address);
                        console.log(txResultBuyService);
                        serviceContractInstance = ServiceContract.at(address);

                        return serviceContractInstance.setMockData.estimateGas(
                            serviceEndDate,
                            //serviceContract.availability,
                            [],
                            serviceStartDate,
                            serviceStartDate,
                            {from: providerAccount}
                        ).then(gasEstimate => serviceContractInstance.setMockData(
                            serviceEndDate,
                            //serviceContract.availability,
                            [],
                            serviceStartDate,
                            serviceStartDate,
                            {from: providerAccount, gas: 2 * gasEstimate})
                        ).catch(error => {
                            console.log("Error in tx setMockData!");
                            console.log(error)
                        });
                    }
                }).then((txResultSetMockData) => {
                    console.log("txResultSetMockData: ");
                    console.log(txResultSetMockData);
                    if (txResultSetMockData !== undefined) {
                        return serviceContractInstance.changeContractDuration(1,
                            {from: customerAccount, value: 2 * serviceContract.costPerDay}
                        ).catch(error => {
                            console.log("Error in tx deposit!");
                            console.log(error)
                        }).then(() => serviceContractInstance.getBalance.call());
                    }
                }).then((balance) => {
                    if (balance !== undefined) {
                        console.log("Created contract: " + serviceContractInstance.address);
                        console.log("\t...with balance of " + balance.c[0]);
                    }
                })
            })
        });


});
