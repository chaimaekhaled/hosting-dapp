// TODO: refactor all functions vars to _name


pragma solidity ^0.4.21;
//pragma experimental ABIEncoderV2;

import "./Hosting.sol";
import "./Service.sol";

contract Provider {
    // Provider's hosting system can listen to this event to start new servers.
    event NewProductBought(address serviceContract);
    event MsgValue(uint value);

    address owner; // Provider's eth address
    address monitoringAgent = 0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef;
    string public name; // Provider's name

    // Withdrawal Pattern
    mapping(address => uint) private pendingWithdrawals;

    // Services
    Hosting.ServiceOffer[] private products;

    // Customers
    address[] private customers;
    mapping(address => address[]) private customerToContracts;


    constructor() public {
        owner = msg.sender;
        name = "defaultName";
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier onlyOwnerOrCustomer(){
        require(msg.sender == owner || isCustomer(msg.sender));
        _;
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

    function isCustomer(address _person) private view returns (bool) {
        bool customer = false;
        for (uint i = 0; i < customers.length; i++) {
            if (_person == customers[i]) customer = true;
        }
        return customer;
    }

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
        ServiceContract(_serviceContract).setServiceDetails(cpu, ram, traffic, ssd);
    }

    function extendServiceWithSla(address _serviceContract, uint _id) internal {
        uint metric = products[_id].sla[0];
        uint highGoal = products[_id].sla[1];
        uint middleGoal = products[_id].sla[2];
        uint refundMiddle = products[_id].sla[3];
        uint refundLow = products[_id].sla[4];
        ServiceContract(_serviceContract).setSla(metric, highGoal, middleGoal, refundMiddle, refundLow);
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

    function getProduct(uint _i) public view returns (string, uint, uint, uint[], uint[]){
        require(_i < products.length && _i >= 0);
        return (
        products[_i].name,
        products[_i].id,
        products[_i].costPerDay,
        products[_i].specs,
        products[_i].sla
        );
    }


    function getAllContractsOfCustomer(address _customer) public view onlyOwnerOrCustomer returns (address[]) {
        if (msg.sender == owner) {
            // Return all contracts from all customers as this function is called by provider
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


