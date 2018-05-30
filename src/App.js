import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,} from 'reactstrap';
import {BrowserRouter as Router, NavLink as NavLinkRRD, Route} from 'react-router-dom';
import Data, {details2array, strDate2int} from "./AppProvider";
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
            providerName: Data.providerName,
            serviceContracts: Data.serviceContracts,
            products: Data.products,
        };
        this.registerWeb3 = this.registerWeb3.bind(this);
        getWeb3
            .then(results => {
                this.setState({web3: results.web3}, () => this.instantiateContract());
            })
            .catch(() => console.log('Error finding web3'))
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    registerWeb3(web3) {
        this.setState({
            web3: web3,
        })
    }

    // instantiateContractPromise = new Promise((resolve, reject) => {
    //     console.log("Trying to instantiate Contract");
    //     console.log("Provider:");
    //     console.log(this.state.web3.currentProvider);
    //
    //     const contract = require('truffle-contract');
    //     const ProviderC = contract(Provider);
    //     const ServiceC = contract(Service);
    //     ProviderC.setProvider(this.state.web3.currentProvider);
    //     console.log(ProviderC);
    //     console.log(ServiceC);
    //     let providerInstance;
    //
    //     // this.state.web3.eth.getAccounts((error, accounts) => {
    //     ProviderC.deployed()
    //         .then((instance) => {
    //             providerInstance = instance;
    //             this.setState({providerInstance: instance});
    //             console.log("Found Instance!");
    //             console.log(instance)
    //         })
    //     // });
    //     resolve(providerInstance);
    // });

    instantiateContract() {
        // console.log("Trying to instantiate Contract");
        // console.log("Provider:");
        // console.log(this.state.web3.currentProvider);

        const contract = require('truffle-contract');
        const ProviderC = contract(Provider);
        // const ServiceC = contract(Service);
        ProviderC.setProvider(this.state.web3.currentProvider);

        // this.state.web3.eth.getAccounts((error, accounts) => {
        ProviderC.deployed()
            .then((instance) => {
                this.setState({providerInstance: instance}, () => this.fillWithMockData());
                // console.log("Found Instance!");
                // console.log(instance)
            })
        // });
        // return (providerInstance);
    }

    async fillWithMockData() {
        // console.log("FillWithMockData");
        // console.log("providerInstance: ");
        // console.log(this.state.providerInstance);
        const contract = require('truffle-contract');
        const ProviderContract = contract(Provider);
        // const ServiceC = contract(Service);
        ProviderContract.setProvider(this.state.web3.currentProvider);

        this.state.web3.eth.getAccounts((error, accounts) => {
            // let providerAccount = accounts[0];
            // let customerAccount = accounts[1];
            let providerAccount = "0x516121B7f5893C637467A5402B7085FE946DEc37";
            let customerAccount = "0xAD8Aa9bDcE3AB547434E522f3639884F745DB49d";
            let providerInstance;

            ProviderContract.defaults({from: providerAccount});
            ProviderContract.deployed()
                .then((instance) => {
                    // get name from contract
                    providerInstance = instance;
                    return instance.getName.call();
                })
                .then((name) => {
                    // set name if necessary
                    console.log("Provider's name in contract: " + name);
                    if (name === "undefined") {
                        return providerInstance.setName(Data.providerName, {from: accounts[0]});
                    }
                    return null;
                })
                .then(() => {
                    return providerInstance.countProducts.call();

                })
                .then((productsCount) => {
                    if (productsCount.c[0] === 0) {
                        Data.products.forEach(async (product) => {
                            console.log("Adding product: " + product.name + " ID " + product.id);
                            await providerInstance.addProduct(
                                product.name,
                                product.costPerDay,
                                details2array(product.details),
                                product.sla, {from: accounts[0]});
                        })
                    }
                })
                .then(async () => {
                    // check if customer already has contracts
                    let pubKey = "myPubKey";
                    let customerContracts = await providerInstance.getAllContractsOfCustomer.call(customerAccount);

                    // instantiate serviceContracts to account[1] (customer)

                    let serviceContractInstance = null;
                    Data.serviceContracts.forEach(async (serviceContract) => {
                        return await providerInstance.buyService(
                            serviceContract.productId,
                            pubKey,
                            {from: customerAccount}
                        ).then((serviceContractAddress) => {
                            console.log("ServiceContractAddress: ");
                            console.log(serviceContractAddress);
                            serviceContractInstance = Service.at(serviceContractAddress);
                            serviceContractInstance.setMockData(
                                strDate2int(serviceContract.endDate),
                                serviceContract.availabilities,
                                strDate2int(serviceContract.startDate), {from: accounts[0]});
                        })
                            .then(() => {
                                return serviceContractInstance.deposit(
                                    {from: customerAccount, value: 3 * serviceContract.costPerDay});
                            })
                            .then((balance) => {
                                console.log("Created contract: " + serviceContractInstance.address);
                                console.log("\t...with balance of " + balance);
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
                            <NavbarBrand href="/">dApp Hosting</NavbarBrand>
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
