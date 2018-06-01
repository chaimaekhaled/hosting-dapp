import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,} from 'reactstrap';
import {BrowserRouter as Router, NavLink as NavLinkRRD, Route} from 'react-router-dom';
import {bigNumArray2intArray, details2dict, serviceData2object} from "./utils/helpers";
import Data from "./utils/Data.json";
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

        this.state = {
            web3: null,
            providerInstance: null,
            isOpen: false, //toggle for navbar
            providerName: null,
            // serviceContracts: null,
            serviceContracts: Data.serviceContracts,
            products: null,
            // providerName: Data.providerName,
            // serviceContracts: Data.serviceContracts,
            // products: Data.products,
        };
        this.toggle = this.toggle.bind(this);
        this.instantiateContract = this.instantiateContract.bind(this);
    }

    componentDidMount() {
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
        const ServiceC = contract(Service);
        ProviderC.setProvider(this.state.web3.currentProvider);
        ServiceC.setProvider(this.state.web3.currentProvider);
        // Fix for http provider with truffle
        if (typeof ProviderC.currentProvider.sendAsync !== "function") {
            ProviderC.currentProvider.sendAsync = function () {
                return ProviderC.currentProvider.send.apply(
                    ProviderC.currentProvider, arguments
                );
            };
        }
        if (typeof ServiceC.currentProvider.sendAsync !== "function") {
            ServiceC.currentProvider.sendAsync = function () {
                return ServiceC.currentProvider.send.apply(
                    ServiceC.currentProvider, arguments
                );
            };
        }

        this.state.web3.eth.getAccounts((error, accounts) => {
            ProviderC.deployed()
                .then((instance) => {
                    this.setState({providerInstance: instance}, () => {
                        let providerInstance = this.state.providerInstance;

                        providerInstance.getName.call()
                            .then((name) => this.setState({providerName: name}))
                            .then(() => providerInstance.countProducts.call())
                            .then(async countOfProducts => {
                                let products = [];
                                for (let i = 0; i < countOfProducts; i++) {
                                    await providerInstance.getProduct.call(i).then(getProduct => {
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
                                return providerInstance.getAllContractsOfCustomer.call(accounts[0])
                            })
                            .then(allContracts => {
                                if (allContracts === undefined) return;
                                return allContracts.map(contract => {
                                    let serviceInstance = ServiceC.at(contract);
                                    let data = serviceInstance.getData.call();
                                    return serviceData2object(data)
                                })
                            })
                            .then(serviceContracts => this.setState({serviceContracts: serviceContracts}))
                    });
                })
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
                               render={() => <Store products={this.state.products}
                                                    providerInstance={this.state.providerInstance}
                                                    web3={this.state.web3}/>}/>
                        <Route path="/billing" title="Billing"
                               render={() => <Billing serviceContracts={this.state.serviceContracts}/>}/>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
