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
import './css/App.css';
// Import contracts and web3
import Provider from "./contracts/Provider.json";
import Service from './contracts/Service.json';
import getWeb3 from './utils/getWeb3';

/*
    App is the heart of the web application. Its state contains all necessary data and the web3 connection to a
     blockchain node.
 */
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
            selectedAccount: "none selected yet",
        };
        this.toggle = this.toggle.bind(this);
        this.instantiateContract = this.instantiateContract.bind(this);
        this.handleContractAddressChanged = this.handleContractAddressChanged.bind(this);
    }

    /*
        load web3 when component did mount. successfull loading of web3 will call instantiateContract()
     */
    componentDidMount() {
        getWeb3
            .then(results => {
                this.setState({web3: results.web3}, this.instantiateContract);
                this.state.web3.currentProvider.publicConfigStore.on('update', this.instantiateContract);
            })
            .catch(() => console.log('Error finding web3'));
    }

    // toggle for navigation bar
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    /*
        instantiateContract() connects to the Provider and Service smart contracts to retrieve all necessary data
         for the web application. Data is stored in this.state
     */
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

        this.setState({serviceContracts: []});

        this.state.web3.eth.getAccounts((error, accounts) => {
            const customerAccount = accounts[0]; // customer account is the one selected in MetaMask
            this.setState({selectedAccount: customerAccount});
            // 'connect' to Provider smart contract
            ProviderC.at(this.state.providerContractAddress)
                .then((instance) => {
                    this.setState({providerInstance: instance}, () => {
                        let providerInstance = this.state.providerInstance;
                        sessionStorage.setItem("providerContractAddress", this.state.providerContractAddress);

                        // Get provider's name
                        providerInstance.getName.call()
                            .then((name) => this.setState({providerName: name}))
                            .then(() => providerInstance.countProducts.call()) // get the count of service offerings
                            .then(async countOfProducts => {
                                let products = [];
                                // for each service offering, retrieve its data
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
                            .then(products => this.setState({products: products})) // add all service offerings to state
                            .then(() => {
                                // retrieve all contracts of the user (the selected account in metamask)
                                return providerInstance.getAllContractsOfCustomer.call(customerAccount, {from: customerAccount})
                                    .catch(() => {
                                        this.setState({serviceContracts: "invalidRequestToGetAllContractsOfCustomer"});
                                        return "invalidRequestToGetAllContractsOfCustomer";
                                    })
                            })
                            // add the data of the retrieved contract to the web application
                            .then(async allContracts => {
                                if (allContracts === undefined || allContracts === "invalidRequestToGetAllContractsOfCustomer") return;
                                console.log("Retreiving all contracts from customer " + customerAccount);
                                console.log("Found contracts: ");
                                console.log(allContracts);
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

                            });
                    })
                })
        })
    }

    // this function handles changes to the address of the Provider smart contract
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
                    <InputGroup>
                        <InputGroupAddon addonType="append"><InputGroupText>Your
                            address</InputGroupText></InputGroupAddon>
                        <Input id="inputContractAddress" style={{textAlign: 'right',}}
                               onChange={() => {
                               }} value={this.state.selectedAccount} disabled/>
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
                                                     tag={NavLinkRRD}>Home</NavLink>
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
