// TODO: refactor all functions vars to _name


pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2 ;

import ". / hosting . sol ";

import "./service.sol";

contract Provider is Hosting {
    // Provider's hosting system can listen to this event to start new servers.
    event NewProductBought(address serviceContract);

    address owner; // Provider's eth address
    string public name; // Provider's name
    // Services
    ServiceOffer[] public products;


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
for (uint i = 0; i < customers.length; i++){
if (_person == customers[i]) customer = true;
}
return customer;
}

function buyService(uint _id, string _customerPublicKey) public payable productIsActive(_id) returns (address) {
// Product is only available for order is flagged as isActive = true

// create a new StandardServer smart contract
ServiceContract serviceContract = new ServiceContract(owner, msg.sender, _customerPublicKey, products[_id].name, products[_id].specs, products[_id].sla);

// pay ETH into this new contract
address(serviceContract).transfer(msg.value);

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

function addProduct(string _name, uint _weeklyCost, ServiceDetails _specs, SLAPolicy _sla) public {//add modifier for access restriction to owner
// Add product to available offers
uint id = products.length;

/*
In case I need to remove structs from function parameters use this:
uint cpu;
uint ram;
uint traffic;
uint ssd;
(cpu, ram, traffic, ssd) = ServiceDetailsToVars(_specs);
ServiceDetails memory specs = ServiceDetails(cpu, ram, traffic, ssd);

Metrics metric;
uint highGoal;
uint middleGoal;
uint refundMiddle;
uint refundLow;
//(metric, highGoal, middleGoal, refundMiddle, refundLow) = SLAPolicyToVars(_sla);
SLAPolicy memory slaPolicy = SLAPolicy(metric, highGoal, middleGoal, refundMiddle, refundLow);
*/

ServiceOffer memory newProduct = ServiceOffer(_name, id, true, _weeklyCost, _specs, _sla);
products.push(newProduct);
}

function activateProduct(uint _id) public onlyOwner{
products[_id].isActive = true;
}

function deactivateProduct(uint _id) public onlyOwner {//add modifier for access restriction to owner
products[_id].isActive = false;
}

function getAllContractsOfCustomer(address _customer) public view onlyOwnerOrCustomer returns(address[]) {
return customerToContracts[_customer];
}
}


