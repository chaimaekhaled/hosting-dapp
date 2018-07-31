import React, {Component} from 'react';
import {
    Alert,
    Button,
    Collapse,
    Container,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Jumbotron,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
} from 'reactstrap';
import {BrowserRouter as Router, NavLink as NavLinkRRD, Route} from 'react-router-dom';
import {bigNumArray2intArray, details2dict, serviceData2object} from "./utils/helpers";
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
            serviceContracts: [],
            products: null,
            providerContractAddress: sessionStorage.getItem("providerContractAddress"),
            defaultProvider: null,
        };
        this.toggle = this.toggle.bind(this);
        this.instantiateContract = this.instantiateContract.bind(this);
        this.handleContractAddressChanged = this.handleContractAddressChanged.bind(this);
    }

    componentDidMount() {
        /*const addr = sessionStorage.getItem("providerContractAddress");
        if(addr){
            this.setState({providerContractAddress: addr});
        }*/
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

        ProviderC.deployed().then(instance => instance.address).then((addr) => this.setState({defaultProvider: addr}));

        if (!this.state.web3.utils.isAddress(this.state.providerContractAddress)) {
            return -1;
        }

        this.state.web3.eth.getAccounts((error, accounts) => {
            const customerAccount = accounts[0];

            ProviderC.at(this.state.providerContractAddress)
                .then((instance) => {
                    this.setState({providerInstance: instance}, () => {
                        let providerInstance = this.state.providerInstance;
                        sessionStorage.setItem("providerContractAddress", this.state.providerContractAddress);

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
                                            //isActive: getProduct[2],
                                            costPerDay: getProduct[2].c[0],
                                            details: details2dict(bigNumArray2intArray(getProduct[3])),
                                            sla: bigNumArray2intArray(getProduct[4]),
                                        };
                                        products.push(product);
                                    });
                                }
                                console.log("Now returning products...");
                                return await products;
                            })
                            .then(products => this.setState({products: products}))
                            .then(() => {
                                return providerInstance.getAllContractsOfCustomer.call(customerAccount)
                            })
                            .then(async allContracts => {
                                if (allContracts === undefined) return;
                                console.log("Retreiving all contracts from customer " + customerAccount);
                                allContracts.forEach(async contractAddr => {
                                    await ServiceC.at(contractAddr)
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
                                                                   let serviceInstance = ServiceC.at(contract);
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
                })
        })
    }

    handleContractAddressChanged(e) {
        this.setState({providerContractAddress: e.target.value});
    }

    render() {
        let defaultProviderAddress =
            <div>{"Default: " + this.state.defaultProvider}</div>;

        let footer = <div>
            <Jumbotron style={{marginBottom: "0px"}}>
                <Container>
                    <InputGroup>
                        <InputGroupAddon addonType="append"><InputGroupText>Contract
                            address</InputGroupText></InputGroupAddon>
                        <Input id="inputContractAddress" style={{textAlign: 'right',}}
                               onChange={this.handleContractAddressChanged} value={this.state.providerContractAddress}/>
                        <InputGroupAddon addonType="prepend">
                            <Button color="primary" onClick={this.instantiateContract}>Submit</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Container>
            </Jumbotron>
        </div>;

        let content = <Container><Alert>Please insert a valid
            ProviderContractAddress</Alert>{footer}{defaultProviderAddress}</Container>;


        if (this.state.providerInstance != null) {
            content =
                <Router>
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
                                   render={() => <Billing serviceContracts={this.state.serviceContracts}
                                                          web3={this.state.web3}/>}/>
                        </div>
                        {footer}
                    </div>
                </Router>;
        }

        return (<div>{content}</div>
        );
    }
}

export default App;
