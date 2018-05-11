pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2 ;

import ". / hosting . sol ";

contract ServiceContract is Hosting {

    address provider;
    address customer;
    string customerPublicKey;

    string name; // name of ServiceOffer
    uint weeklyCost;
    ServiceDetails specs;
    SLAPolicy sla;

    uint endDate; // time until the service is active

constructor(address _provider, address _customer, string _customerPublicKey, string _name, ServiceDetails _specs, SLAPolicy _sla) public {
provider = _provider;
customer = _customer;
customerPublicKey = _customerPublicKey;
name = _name;
specs = _specs;
sla = _sla;
}

modifier onlyPartners(){
require(msg.sender == provider || msg.sender == customer);
_;
}

function deposit() public payable {
recalculateServiceDuration();
}

function withdraw(uint _amount) public onlyPartners {
require (_amount >= address(this).balance);
customer.transfer(_amount);
}

function recalculateServiceDuration() public {
uint duration = address(this).balance / weeklyCost;
endDate = now + duration;
}

}