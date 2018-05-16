// TODO: convert between ether and wei!

pragma solidity ^0.4.19;
//pragma experimental ABIEncoderV2;

import "./hosting.sol";

contract ServiceContract is Hosting {

    address provider;
    address customer;
    address providerContract;
    string customerPublicKey;

    string name; // name of ServiceOffer
    uint weeklyCost;
    ServiceDetails specs;
    SLAPolicy sla;

    // Flag to prevent SLA and Specs to be changed after they have been set
    bool slaSet = false;
    bool specsSet = false;

    uint endDate; // time until the service is active

    /*
    "0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","pubKey","vServerSmall", 2
    */

    constructor(address _provider, address _customer, address _providerContract, string _customerPublicKey, string _name, uint _weeklyCost) public {
        provider = _provider;
        customer = _customer;
        providerContract = _providerContract;
        customerPublicKey = _customerPublicKey;
        name = _name;
        weeklyCost = _weeklyCost;
    }

    modifier onlyPartners(){
        require(msg.sender == provider || msg.sender == customer || msg.sender == providerContract);
        _;
    }

    function setSla(Metrics _metric,
        uint _highGoal, uint _middleGoal,
        uint _refundMiddle, uint _refundLow) public onlyPartners {
        require(!slaSet);
        sla = SLAPolicy(_metric, _highGoal, _middleGoal, _refundMiddle, _refundLow);
        slaSet = true;
    }

    function setServiceDetails(uint _cpu, uint _ram,
        uint _traffic, uint _ssd) public onlyPartners {
        require(!specsSet);
        specs = ServiceDetails(_cpu, _ram, _traffic, _ssd);
        specsSet = true;
    }

    function deposit() public payable returns (uint){
        return address(this).balance;
    }

    function withdraw(uint _amount) public onlyPartners {
        require(_amount <= address(this).balance);
        customer.transfer(_amount);
    }

    function recalculateServiceDuration() public {
        uint duration = uint(address(this).balance) / weeklyCost;
        endDate = now + duration;
    }

    function getEndDate() public view onlyPartners returns (uint){
        return endDate;
    }

}