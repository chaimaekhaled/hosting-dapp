pragma solidity ^0.4.21;

import "./Hosting.sol";
import "./ProviderDatabase.sol";
import "./Service.sol";

contract ProviderLogic is ProviderDatabase {
    function buyService(uint _id, string _customerPublicKey) public payable returns (address) {
        // Require payment for at least a day of Service
        require(msg.value >= products[_id].costPerDay, "Transfer funds for at least a day of service!");

        // create a new StandardServer smart contract
        uint id = 0;
        id = customerToContracts[msg.sender].length;

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


        emit MsgValue(msg.value);

        extendServiceWithServiceDetails(serviceContract, _id);
        extendServiceWithSla(serviceContract, _id);

        // pay ETH into this new contract
        serviceContract.changeContractDuration.value(msg.value)(1);
        // serviceContract.deposit.value(msg.value)();

        // add new contract to customerDB
        customerToContracts[msg.sender].push(serviceContract);

        // add customer to customers;
        if (!isCustomer(msg.sender)) customers.push(msg.sender);

        // emit EVENT to inform about creation of contract
        emit NewProductBought(address(serviceContract));

        // return contract's address
        return address(serviceContract);
    }


    function extendServiceWithServiceDetails(address _serviceContract, uint _id) internal {
        uint cpu = products[_id].specs[0];
        uint ram = products[_id].specs[1];
        uint traffic = products[_id].specs[2];
        uint ssd = products[_id].specs[3];
        Service(_serviceContract).setServiceDetails(cpu, ram, traffic, ssd);
    }

    function extendServiceWithSla(address _serviceContract, uint _id) internal {
        uint metric = products[_id].sla[0];
        uint highGoal = products[_id].sla[1];
        uint middleGoal = products[_id].sla[2];
        uint refundMiddle = products[_id].sla[3];
        uint refundLow = products[_id].sla[4];
        Service(_serviceContract).setSla(metric, highGoal, middleGoal, refundMiddle, refundLow);
    }
    //function addProduct(string _name, uint _costPerDay, ServiceDetails _specs, SLAPolicy _sla) public onlyOwner {
    function addProduct(
        string _name, uint _costPerDay, uint[] _specs, uint[] _sla) public onlyOwner {

        // Add product to available offers
        uint id = products.length;

        Hosting.ServiceOffer memory newProduct = Hosting.ServiceOffer(_name, id, _costPerDay, _specs, _sla);
        products.push(newProduct);
    }
    /*
"vServerSmall", 12, [1, 2, 10, 20], [0, 99, 95, 15, 100]
"vServerBig", 30, [4,16,100,200], [0, 99, 92, 20, 95]
*/
    function countProducts() public view returns (uint){
        return products.length;
    }

}
