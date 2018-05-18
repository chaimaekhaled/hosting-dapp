// TODO: refactor all functions vars to _name


pragma solidity ^0.4.19;
//pragma experimental ABIEncoderV2;

import "./Hosting.sol";
import "./Service.sol";

contract Provider is Hosting {
    // Provider's hosting system can listen to this event to start new servers.
    event NewProductBought(address serviceContract);
    event NewServiceContract(address serviceContract);
    event MsgValue(uint value);

    address owner; // Provider's eth address
    string public name; // Provider's name

    // Withdrawal Pattern
    mapping(address => uint) private pendingWithdrawals;
    
    // Services
    ServiceOffer[] private products;


    // Customers
    address[] private customers;
    mapping(address => address[]) private customerToContracts;


    constructor(string _name) public {
        owner = msg.sender;
        name = _name;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier onlyOwnerOrCustomer(){
        require(msg.sender == owner || isCustomer(msg.sender));
        _;
    }

    modifier productIsActive(uint _id){
        require(products[_id].isActive);
        _;
    }

    function isCustomer(address _person) private view returns (bool) {
        bool customer = false;
        for (uint i = 0; i < customers.length; i++) {
            if (_person == customers[i]) customer = true;
        }
        return customer;
    }

    function buyService(uint _id, string _customerPublicKey) public payable productIsActive(_id) returns (address) {
        // Product is only available for order is flagged as isActive = true

        // create a new StandardServer smart contract
        ServiceContract serviceContract = (new ServiceContract).value(msg.value)(
            owner, msg.sender, this,
    _customerPublicKey, products[_id].name, products[_id].costPerDay
        );

        emit NewServiceContract(serviceContract);
        emit MsgValue(msg.value);

        extendServiceWithServiceDetails(serviceContract, _id);
        extendServiceWithSla(serviceContract, _id);

        // pay ETH into this new contract
        //address(serviceContract).transfer(msg.value);

        // Calculate service duration based on msg.value
        serviceContract.recalculateServiceDuration();

        // add new contract to customerDB
        customerToContracts[msg.sender].push(serviceContract);

        // add customer to customers;
        if (!isCustomer(msg.sender)) customers.push(msg.sender);

        // emit EVENT to inform about creation of contract
        emit NewProductBought(address(serviceContract));

        // return contract's address
        return serviceContract;
    }

    function extendServiceWithServiceDetails(address _serviceContract, uint _id) internal {
        uint cpu;
        uint ram;
        uint traffic;
        uint ssd;
        (cpu, ram, traffic, ssd) = ServiceDetailsToVars(products[_id].specs);
        ServiceContract(_serviceContract).setServiceDetails(cpu, ram, traffic, ssd);
    }

    function extendServiceWithSla(address _serviceContract, uint _id) internal {
        Metrics metric;
        uint highGoal;
        uint middleGoal;
        uint refundMiddle;
        uint refundLow;
        (metric, highGoal, middleGoal, refundMiddle, refundLow) = SLAPolicyToVars(products[_id].sla);
        ServiceContract(_serviceContract).setSla(metric, highGoal, middleGoal, refundMiddle, refundLow);
    }

    //function addProduct(string _name, uint _costPerDay, ServiceDetails _specs, SLAPolicy _sla) public onlyOwner {
    function addProduct(
        string _name, uint _costPerDay, uint[] _specs, uint[] _sla) public onlyOwner {

        // Add product to available offers
        uint id = products.length;

        /*uint cpu;
        uint ram;
        uint traffic;
        uint ssd;*/
        //(cpu, ram, traffic, ssd) = ServiceDetailsToVars(_specs);
        ServiceDetails memory specs = ServiceDetails(_specs[0], _specs[1], _specs[2], _specs[3]);

        /*Metrics metric;
        uint highGoal;
        uint middleGoal;
        uint refundMiddle;
        uint refundLow;*/
        //(metric, highGoal, middleGoal, refundMiddle, refundLow) = SLAPolicyToVars(_sla);
        SLAPolicy memory slaPolicy = SLAPolicy(Metrics(_sla[0]), _sla[1], _sla[2], _sla[3], _sla[4]);

        ServiceOffer memory newProduct = ServiceOffer(_name, id, true, _costPerDay, specs, slaPolicy);
        products.push(newProduct);
    }
    /*
"vServerSmall", 12, [1, 2, 10, 20], [0, 99, 95, 15, 100]
"vServerBig", 30, [4,16,100,200], [0, 99, 92, 20, 95]
*/
    function countProducts() public view returns (uint){
        return products.length;
    }

    function getProduct(uint _i) public view returns (string, uint, bool, uint, uint[], uint[]){
        require(_i < products.length && _i >= 0);
        return (
        products[_i].name,
        products[_i].id,
        products[_i].isActive,
        products[_i].costPerDay,
        ServiceDetailsToArray(products[_i].specs),
        SLAPolicyToArray(products[_i].sla)
        );
    }


    function activateProduct(uint _id) public onlyOwner {
        products[_id].isActive = true;
    }

    function deactivateProduct(uint _id) public onlyOwner {
        products[_id].isActive = false;
    }

    function getAllContractsOfCustomer(address _customer) public view onlyOwnerOrCustomer returns (address[]) {
        return customerToContracts[_customer];
    }
}


