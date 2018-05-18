// TODO: convert between ether and wei!

pragma solidity ^0.4.19;
//pragma experimental ABIEncoderV2;

import "./hosting.sol";

contract ServiceContract is Hosting {

    event LogNumber(uint n);
    event Log(string text);

    address provider;
    address customer;
    address providerContract;
    string customerPublicKey;

    string name; // name of ServiceOffer
    uint costPerDay;
    ServiceDetails specs;
    SLAPolicy sla;

    // Flag to prevent SLA and Specs to be changed after they have been set
    bool slaSet = false;
    bool specsSet = false;

    // Billing
    uint endDate; // time until the service is active
    uint lastCalculationDate; // Date when the costs have been calculated last and service has been paid
    uint withdrawableForProvider; // service fee that is withdrawable for the provider

    /*
    "0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","pubKey","vServerSmall", 2
    */

    constructor(address _provider, address _customer, address _providerContract, string _customerPublicKey, string _name, uint _costPerDay) public payable {
        provider = _provider;
        customer = _customer;
        providerContract = _providerContract;
        customerPublicKey = _customerPublicKey;
        name = _name;
        costPerDay = _costPerDay;
    }

    modifier onlyPartners(){
        require(msg.sender == provider || msg.sender == customer || msg.sender == providerContract);
        _;
    }

    modifier onlyProvider(){
        require(msg.sender == provider || msg.sender == providerContract);
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

    function withdrawProvider() public onlyProvider {
        msg.sender.transfer(withdrawableForProvider);
    }

    function recalculateServiceDuration() public {
        uint durationInDays = 1 days * (uint(address(this).balance) / costPerDay);
        endDate = now + durationInDays;
        emit LogNumber(durationInDays);
    }

    function getEndDate() public view onlyPartners returns (uint){
        return endDate;
    }

    function getBalance() public view onlyPartners returns (uint){
        return address(this).balance;
    }

    function getAll() public view onlyPartners returns (address, address, address, string, string, uint, uint[], uint[]){
        return (provider, customer, providerContract, customerPublicKey, name, costPerDay, ServiceDetailsToArray(specs), SLAPolicyToArray(sla));
    }
}