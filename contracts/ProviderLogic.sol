pragma solidity ^0.4.21;

import "./Hosting.sol";
import "./ProviderDatabase.sol";
import "./Service.sol";

/*
    This file includes the ProviderLogic smart contract, that contains relevant business logic for the Provider smart
     contract, most importantly the buyService function.
*/

contract ProviderLogic is ProviderDatabase {

    // the buyService function allows to buy one of the provider's service offerings, specified by _id
    function buyService(uint _id, string _customerPublicKey) public payable returns (address) {
        // Require payment for at least a day of service
        require(msg.value >= products[_id].costPerDay, "Transfer funds for at least a day of service!");

        // id for the new Service smart contract. Depends on the count of Service contract that the customer already has
        uint id = 0;
        id = customerToContracts[msg.sender].length;

        // create new instance of Service smart contract
        Service serviceContract = new Service(
            id, //service id
            owner,
            msg.sender,
            monitoringAgent,
            address(this),
            _customerPublicKey,
            products[_id].name,
            products[_id].costPerDay,
            _id);
        // id of product

        // for logging purposes
        emit MsgValue(msg.value);

        // add SLA and Service Details to the newly created Service smart contract
        extendServiceWithServiceDetails(serviceContract, _id);
        extendServiceWithSla(serviceContract, _id);

        // pay ETH to this new contract
        serviceContract.changeContractDuration.value(msg.value)(1);

        // add new contract to customerDB
        customerToContracts[msg.sender].push(serviceContract);

        // add customer to customers;
        if (!isCustomer(msg.sender)) customers.push(msg.sender);

        // emit EVENT to inform about creation of contract
        emit NewProductBought(address(serviceContract));

        // return contract's address
        return address(serviceContract);
    }

    /*
    This internal function is required for creating a new Service smart contract (by buyService function) as it
    removes the need to pass all parameters with the constructor of Service.sol
    */
    function extendServiceWithServiceDetails(address _serviceContract, uint _id) internal {
        uint cpu = products[_id].specs[0];
        uint ram = products[_id].specs[1];
        uint traffic = products[_id].specs[2];
        uint ssd = products[_id].specs[3];
        Service(_serviceContract).setServiceDetails(cpu, ram, traffic, ssd);
    }


    /*
    This internal function is required for creating a new Service smart contract (by buyService function) as it
    removes the need to pass all parameters with the constructor of Service.sol
    */
    function extendServiceWithSla(address _serviceContract, uint _id) internal {
        uint metric = products[_id].sla[0];
        uint highGoal = products[_id].sla[1];
        uint middleGoal = products[_id].sla[2];
        uint refundMiddle = products[_id].sla[3];
        uint refundLow = products[_id].sla[4];
        Service(_serviceContract).setSla(metric, highGoal, middleGoal, refundMiddle, refundLow);
    }

    /*
        addProduct allows the provider to add a new service offering to this provider Smart Contract.
        The arrays _specs and _sla are similar to the structs of hosting.sol:
        _specs: [cpu, ram, traffic, ssd]
        _sla: [metric, highGoal, middleGoal, refundMiddle, refundLow]

        Example parameters are:
            "vServerSmall", 12, [1, 2, 10, 20], [0, 99, 95, 15, 100]
            "vServerBig", 30, [4,16,100,200], [0, 99, 92, 20, 95]
     */
    function addProduct(
        string _name, uint _costPerDay, uint[] _specs, uint[] _sla) public onlyOwner {

        // Add product to available offers
        uint id = products.length;

        Hosting.ServiceOffer memory newProduct = Hosting.ServiceOffer(_name, id, _costPerDay, _specs, _sla);
        products.push(newProduct);
    }

    function countProducts() public view returns (uint){
        return products.length;
    }

}
