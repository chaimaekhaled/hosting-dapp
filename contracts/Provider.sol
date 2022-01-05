pragma solidity ^0.4.21;

import "./Hosting.sol";
import "./Service.sol";
import "./ProviderLogic.sol";

/*
    This file contains the Provider smart contract. It provides the constructor, getter, and setter methods. The
    Provider smart contracts inherits from ProviderLogic, which inherits from ProviderDatabase. Deploy this smart
    contract to create a new instance of a provider.
*/
contract Provider is ProviderLogic {

    constructor() public {
        owner = msg.sender;
        name = "defaultName";
    }


    function getOwner() public view returns (address){
        return owner;
    }

    function getName() public view returns (string){
        return name;
    }

    function setName(string _name) public onlyOwner {
        name = _name;
    }

   

    function getProduct(uint _id) public view returns (string, uint, uint, uint[], uint[]){
        require(_id < products.length && _id >= 0);
        return (
        products[_id].name,
        products[_id].id,
        products[_id].costPerDay,
        products[_id].specs,
        products[_id].sla
        );
    }

   
    function getAllContractsOfCustomer(address _customer) public view onlyOwnerOrCustomer returns (address[]) {
        if (msg.sender == owner) {
            
            uint countOfAllContracts = 0;
            for (uint i = 0; i < customers.length; i++) {
                countOfAllContracts += customerToContracts[customers[i]].length;
            }

            address[] memory contracts = new address[](countOfAllContracts);

            for (uint y = 0; y < customers.length; y++) {
                for (uint x = 0; x < customerToContracts[customers[y]].length; x++) {
                    contracts[countOfAllContracts - 1] = customerToContracts[customers[y]][x];
                    countOfAllContracts -= 1;
                }
            }
            return contracts;

        }
        return customerToContracts[_customer];
    }
}


