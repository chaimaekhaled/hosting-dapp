import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,} from 'reactstrap';
import {BrowserRouter as Router, NavLink as NavLinkRRD, Route} from 'react-router-dom';
import Data from "./AppProvider";
// Import views
import Home from "./layout/home/Home";
import Billing from "./layout/billing/Billing";
import Store from "./layout/store/Store";
// Import css
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false, //toggle for navbar
            providerName: Data.providerName,
            serviceContracts: Data.serviceContracts,
            products: Data.products,
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
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
