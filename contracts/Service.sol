pragma solidity ^0.4.19;

import "./ServiceBilling.sol";

contract Service is ServiceBilling {
    constructor(address _provider, address _customer, address _providerContract, string _customerPublicKey, string _name, uint _costPerDay)  public payable {
        provider = _provider;
        customer = _customer;
        providerContract = _providerContract;
        customerPublicKey = _customerPublicKey;
        name = _name;
        costPerDay = _costPerDay;
    }
}
