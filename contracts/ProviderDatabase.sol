pragma solidity ^0.4.21;

import "./Hosting.sol";

contract ProviderDatabase {
    event NewProductBought(address serviceContract);
    event MsgValue(uint value);

    address owner; // Provider's ethereum address
    address monitoringAgent = 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef;
    string public name; // Provider's name

    // Withdrawal Pattern
    mapping(address => uint) internal pendingWithdrawals;

    // Services
    Hosting.ServiceOffer[] internal products;

    // Customers
    address[] internal customers;
    mapping(address => address[]) internal customerToContracts;

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier onlyOwnerOrCustomer(){
        require(msg.sender == owner || isCustomer(msg.sender));
        _;
    }

    function isCustomer(address _person) internal view returns (bool) {
        bool customer = false;
        for (uint i = 0; i < customers.length; i++) {
            if (_person == customers[i]) customer = true;
        }
        return customer;
    }

}
