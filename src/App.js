import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,} from 'reactstrap';
import {BrowserRouter as Router, NavLink as NavLinkRRD, Route} from 'react-router-dom';
import Data, {bigNumArray2intArray, details2array, details2dict, strDate2int} from "./AppProvider";
// Import views
import Home from "./layout/home/Home";
import Billing from "./layout/billing/Billing";
import Store from "./layout/store/Store";
// Import css
import './App.css';
// Import contracts and web3
import Provider from "./contracts/Provider.json";
import Service from './contracts/Service.json';
import getWeb3 from './utils/getWeb3';

class App extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            web3: null,
            providerInstance: null,
            isOpen: false, //toggle for navbar
            providerName: null,
            serviceContracts: null,
            products: null,
            // providerName: Data.providerName,
            // serviceContracts: Data.serviceContracts,
            // products: Data.products,
        };
        getWeb3
            .then(results => {
                this.setState({web3: results.web3}, this.instantiateContract);
            })
            .catch(() => console.log('Error finding web3'));
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    instantiateContract() {
        // console.log("Trying to instantiate Contract");
        // console.log("Provider:");
        // console.log(this.state.web3.currentProvider);

        const contract = require('truffle-contract');
        const ProviderC = contract(Provider);
        // const ServiceC = contract(Service);
        ProviderC.setProvider(this.state.web3.currentProvider);
        // Fix for http provider with truffle
        if (typeof ProviderC.currentProvider.sendAsync !== "function") {
            ProviderC.currentProvider.sendAsync = function () {
                return ProviderC.currentProvider.send.apply(
                    ProviderC.currentProvider, arguments
                );
            };
        }

        ProviderC.deployed()
            .then((instance) => {
                this.setState({providerInstance: instance}, () => {
                    let providerInstance = this.state.providerInstance;

                    providerInstance.getName.call()
                        .then((name) => this.setState({providerName: name}))
                        .then(() => providerInstance.countProducts.call())
                        .then(countOfProducts => {
                            let products = [];
                            for (let i = 0; i < countOfProducts; i++) {
                                providerInstance.getProduct.call(i).then(getProduct => {
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
                            this.setState({products: products}, this.render);
                        });
                });


                // this.setState({providerInstance: instance}, () => this.fillWithMockData());
            })
    }

    fillWithMockData() {
        // console.log("FillWithMockData");
        // console.log("providerInstance: ");
        // console.log(this.state.providerInstance);
        const contract = require('truffle-contract');
        const ProviderContract = contract(Provider);
        const ServiceContract = contract(Service);
        // const ServiceC = contract(Service);
        ProviderContract.setProvider(this.state.web3.currentProvider);
        ServiceContract.setProvider(this.state.web3.currentProvider);

        this.state.web3.eth.getAccounts((error, accounts) => {
            let providerAccount = accounts[0];
            let customerAccount = accounts[1];
            // let providerAccount = "0x516121B7f5893C637467A5402B7085FE946DEc37";
            // let customerAccount = "0xAD8Aa9bDcE3AB547434E522f3639884F745DB49d";
            let providerInstance;

            ProviderContract.defaults({from: providerAccount});
            ProviderContract.deployed()
                .then(async (instance) => {
                    // get name from contract
                    providerInstance = instance;
                    console.log("ProviderContract: " + instance.address);
                    let name = await providerInstance.name.call();
                    return name;
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
                .then(async (productsCount) => {
                    console.log("Count of products:" + productsCount.c[0]);
                    if (productsCount.c[0] === 0) {
                        await Data.products.forEach((product) => {
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
                    return await providerInstance.countProducts.call();
                })
                .then((countProducts) => {
                    if (countProducts.c[0] === 0) {
                        console.log("No products found!");
                    }
                    // check if customer already has contracts
                    let pubKey = "myPubKey";
                    //let customerContracts = await providerInstance.getAllContractsOfCustomer.call(customerAccount);

                    // instantiate serviceContracts to account[1] (customer)
                    Data.serviceContracts.forEach((mockServiceContract) => {
                        console.log("Trying to buy: ");
                        console.log(mockServiceContract);
                        let serviceContract = mockServiceContract;
                        let serviceContractInstance = null;

                        providerInstance.buyService.estimateGas(
                            serviceContract.productId,
                            pubKey,
                            {from: customerAccount}
                        ).then(gasEstimate => providerInstance.buyService(
                            serviceContract.productId,
                            pubKey,
                            {from: customerAccount, gas: 2 * gasEstimate})
                        ).catch(error => {
                            console.log("Error in tx buyService!");
                            console.log(error)
                        }).then((txResultBuyService) => {
                            if (txResultBuyService !== undefined) {
                                console.log("MockServiceContract: ");
                                console.log("endDate: " + strDate2int(serviceContract.endDate));
                                console.log("availability: " + serviceContract.availability);
                                console.log("startDate: " + strDate2int(serviceContract.startDate));
                                let address = txResultBuyService.logs[1].args.serviceContract;
                                console.log("Service contract: " + address);
                                console.log(txResultBuyService);
                                serviceContractInstance = ServiceContract.at(address);

                                return serviceContractInstance.setMockData.estimateGas(
                                    strDate2int(serviceContract.endDate),
                                    serviceContract.availability,
                                    strDate2int(serviceContract.startDate),
                                    {from: providerAccount}
                                ).then(gasEstimate => serviceContractInstance.setMockData(
                                    strDate2int(serviceContract.endDate),
                                    serviceContract.availability,
                                    strDate2int(serviceContract.startDate),
                                    {from: providerAccount, gas: 2 * gasEstimate})
                                ).catch(error => {
                                    console.log("Error in tx setMockData!");
                                    console.log(error)
                                });
                            }
                            return undefined;
                        }).then((txResultSetMockData) => {
                            console.log("txResultSetMockData: ");
                            console.log(txResultSetMockData);
                            if (txResultSetMockData !== undefined) {
                                return serviceContractInstance.deposit(
                                    {from: customerAccount, value: 3 * serviceContract.costPerDay}
                                ).catch(error => {
                                    console.log("Error in tx deposit!");
                                    console.log(error)
                                }).then(() => serviceContractInstance.getBalance.call());
                            }
                            return undefined;
                        }).then((balance) => {
                            if (balance !== undefined) {
                                console.log("Created contract: " + serviceContractInstance.address);
                                console.log("\t...with balance of " + balance.c[0]);
                            }
                        })
                    })
                });

            // OLD

        })
    }


    render() {
        return (<Router>
                <div>
                    <div>
                        <Navbar color="dark" dark expand="sm">
                            <NavbarBrand href="/">{this.state.providerName}</NavbarBrand>
                            <NavbarToggler onClick={this.toggle}/>
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink exact to="/" activeClassName='active'
                                                 tag={NavLinkRRD}>Overview</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink to="/store" activeClassName='active'
                                                 tag={NavLinkRRD}>Store</NavLink>
                                    </NavItem>
                                    {/*<NavItem>
                                        <NavLink to="/monitoring" activeClassName='active'
                                                 tag={NavLinkRRD}>Monitoring</NavLink>
                                    </NavItem>*/}
                                    <NavItem>
                                        <NavLink to="/billing" activeClassName='active'
                                                 tag={NavLinkRRD}>Billing</NavLink>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </Navbar>
                    </div>
                    <div>
                        <Route exact path="/" title="Home" component={Home}/>
                        <Route path="/store" title="Store"
                               render={() => <Store products={this.state.products}/>}/>
                        <Route path="/billing" title="Billing"
                               render={() => <Billing serviceContracts={this.state.serviceContracts}/>}/>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
