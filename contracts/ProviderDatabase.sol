pragma solidity ^0.4.21;

import "./Hosting.sol";

/*
    This file contains the ProviderDatabase smart contract that serves to store data (service offerings, customers,
    Service contracts per customer). It also offers important modifiers for the Provider smart contract and defines
    events than can be emitted.
*/

contract ProviderDatabase {
    event NewProductBought(address serviceContract);
    event MsgValue(uint value);

    address owner; // Provider's ethereum address
    /*
     monitoringAgent is a fixed address per default, can be
     changed by the provider if another monitoringAgent is prefered
    */
    address monitoringAgent = 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef;
    string public name; // Provider's name

    // This array contains the service offerings of the provider
    Hosting.ServiceOffer[] internal products;

    // Customers
    address[] internal customers;
    // Service contracts per customer
    mapping(address => address[]) internal customerToContracts;

    // modifier to restrict access to provider
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    // modifier to restrict access to provider or customer
    modifier onlyOwnerOrCustomer(){
        require(msg.sender == owner || isCustomer(msg.sender));
        _;
    }

    // helping function that checks if an address (_person) is a customer of this provider
    function isCustomer(address _person) internal view returns (bool) {
        bool customer = false;
        for (uint i = 0; i < customers.length; i++) {
            if (_person == customers[i]) customer = true;
        }
        return customer;
    }

}
