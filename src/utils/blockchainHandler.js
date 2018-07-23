import ProviderSmartContract from "../contracts/Provider.json";
import ServiceSmartContract from '../contracts/Service.json';
import getWeb3 from '../utils/getWeb3';
import {bigNumArray2intArray, details2dict, serviceData2object} from "./helpers";

const ProviderContractAddress = "0x345ca3e014aaf5dca488057592ee47305d9b3e10";


const contract = require('truffle-contract');
const ProviderContract = contract(ProviderSmartContract);
const ServiceContract = contract(ServiceSmartContract);
const web3 = getWeb3.then(results => {
    ProviderContract.setProvider(results.web3.currentProvider);
    ServiceContract.setProvider(results.web3.currentProvider);
    // Fix for http provider with truffle
    if (typeof ProviderContract.currentProvider.sendAsync !== "function") {
        ProviderContract.currentProvider.sendAsync = function () {
            return ProviderContract.currentProvider.send.apply(
                ProviderContract.currentProvider, arguments
            );
        };
    }
    if (typeof ServiceContract.currentProvider.sendAsync !== "function") {
        ServiceContract.currentProvider.sendAsync = function () {
            return ServiceContract.currentProvider.send.apply(
                ServiceContract.currentProvider, arguments
            );
        };
    }
    return results.web3;
}).catch(() => console.log('Error finding web3'));
const ProviderContractInstance = ProviderContract.at(ProviderContractAddress);

function instantiateContract() {
    // console.log("Trying to instantiate Contract");
    // console.log("Provider:");
    // console.log(this.state.web3.currentProvider);

    web3.eth.getAccounts((error, accounts) => {
        const customerAccount = accounts[0];

        ProviderContractInstance.getName.call()
            .then((name) => this.setState({providerName: name}))
            .then(() => ProviderContractInstance.countProducts.call())
            .then(async countOfProducts => {
                let products = [];
                for (let i = 0; i < countOfProducts; i++) {
                    await ProviderContractInstance.getProduct.call(i).then(getProduct => {
                        console.log("Received product from blockchain:");
                        console.log(getProduct);
                        let product = {
                            name: getProduct[0],
                            id: getProduct[1].c[0],
                            isActive: getProduct[2],
                            costPerDay: getProduct[3].c[0],
                            details: details2dict(bigNumArray2intArray(getProduct[4])),
                            sla: bigNumArray2intArray(getProduct[5]),
                        };
                        products.push(product);
                    });
                }
                console.log("Now returning products...");
                return await products;
            })
            .then(products => this.setState({products: products}))
            .then(() => {
                return ProviderContractInstance.getAllContractsOfCustomer.call(customerAccount)
            })
            .then(async allContracts => {
                if (allContracts === undefined) return;
                console.log("Retreiving all contracts from customer " + customerAccount);
                allContracts.forEach(async contractAddr => {
                    await ServiceContract.at(contractAddr)
                        .then(instance => instance.getData.call())
                        .then(data => serviceData2object(data))
                        .then(serviceContractObject => {
                            let newArr = this.state.serviceContracts;
                            newArr.push(serviceContractObject);
                            console.log("Added ServiceContract to state: ");
                            console.log(serviceContractObject);
                            this.setState({
                                serviceContracts: newArr,
                            })
                        })
                });

                /*
                 return await allContracts.map(async contract => {
                                                   let serviceInstance = ServiceContract.at(contract);
                                                   console.log("Get data for: " + contract);
                                                   let data = await serviceInstance.getData.call().then(data => serviceData2object(data));
                                                   console.log(data);
                                                   return data;
                                               })
                                           })
                                           .then(serviceContracts => this.setState(
                                               {serviceContracts: serviceContracts},
                                               () => {
                                                   console.log("Wrote ServiceContracts to App.state");
                                                   console.log(serviceContracts);
                                               })
                                           )
                                           */
            });
    })
}

