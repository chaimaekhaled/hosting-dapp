import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,} from 'reactstrap';
import {NavLink as NavLinkRRD, Route} from 'react-router-dom';
// Import views
import Home from "./layout/home/Home";
import Billing from "./layout/billing/Billing";
import Store from "./layout/store/Store";
import Monitoring from "./layout/monitoring/Monitoring";
// Import css
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        document.title = "dApp Hosting";

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <main>
                <div>
                    <Navbar color="dark" dark expand="sm">
                        <NavbarBrand href="/">dApp Hosting</NavbarBrand>
                        <NavbarToggler onClick={this.toggle}/>
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink exact to="/" activeClassName='active' tag={NavLinkRRD}>Overview</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/store" activeClassName='active' tag={NavLinkRRD}>Store</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/monitoring" activeClassName='active'
                                             tag={NavLinkRRD}>Monitoring</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/billing" activeClassName='active' tag={NavLinkRRD}>Billing</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
                <div>
                    <Route exact path="/" title="Home" component={Home}/>
                    <Route path="/store" title="Store" component={Store}/>
                    <Route path="/monitoring" title="Monitoring" component={Monitoring}/>
                    <Route path="/billing" title="Billing" component={Billing}/>
                </div>
            </main>
        );
    }
}

export default App;
