// TODO: convert between ether and wei!

pragma solidity ^0.4.19;

import "./Hosting.sol";

contract ServiceContract {

    event LogNumber(uint n);
    event Log(string text);

    address provider;
    address customer;
    address providerContract;
    string customerPublicKey;

    string name; // name of ServiceOffer
    Hosting.ServiceDetails specs;
    Hosting.SLAPolicy sla;

    // Flag to prevent SLA and Specs to be changed after they have been set
    bool slaSet = false;
    bool specsSet = false;

    /*
    "0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","pubKey","vServerSmall", 2
    */

    /*constructor(address _provider, address _customer, address _providerContract, string _customerPublicKey, string _name, uint _costPerDay) public payable {

    }*/

    modifier onlyPartners(){
        require(msg.sender == provider || msg.sender == customer || msg.sender == providerContract);
        _;
    }

    modifier onlyProvider(){
        require(msg.sender == provider || msg.sender == providerContract);
        _;
    }

    function setSla(Hosting.Metrics _metric,
        uint _highGoal, uint _middleGoal,
        uint _refundMiddle, uint _refundLow) public onlyPartners {
        require(!slaSet, "SLA cannot be set again!");
        sla = Hosting.SLAPolicy(_metric, _highGoal, _middleGoal, _refundMiddle, _refundLow);
        slaSet = true;
    }

    function setServiceDetails(uint _cpu, uint _ram,
        uint _traffic, uint _ssd) public onlyPartners {
        require(!specsSet);
        specs = Hosting.ServiceDetails(_cpu, _ram, _traffic, _ssd);
        specsSet = true;
    }

    function deposit() public payable returns (uint){
        return address(this).balance;
    }

    //required for truffle testing
    function() external payable {}

    /*function getAll() public view onlyPartners returns (address, address, address, string, string, uint, uint[], uint[]){
        return (provider, customer, providerContract, customerPublicKey, name, costPerDay, ServiceDetailsToArray(specs), SLAPolicyToArray(sla));
    }*/


}