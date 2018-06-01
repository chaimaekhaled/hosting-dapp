// TODO: convert between ether and wei!

pragma solidity ^0.4.21;

import "./Hosting.sol";

contract ServiceContract {

    event LogNumber(uint n);
    event Log(string text);
    event ContractStateChanged(bool isActive);
    event PenaltyCalculated(uint quality, uint penalty);

    uint costPerDay;

    address provider;
    address customer;
    address providerContract;
    string customerPublicKey;
    uint productId;
    uint serviceId;
    bool isActive = false;
    uint startDay = now;

    string name; // name of ServiceOffer
    uint[] specs;
    uint[] sla;

    // Flag to prevent SLA and Specs to be changed after they have been set
    bool slaSet = false;
    bool specsSet = false;

    /*
    "0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","pubKey","vServerSmall", 2
    */

    /*constructor(address _provider, address _customer, address _providerContract, string _customerPublicKey, string _name, uint _costPerDay) public payable {

    }*/

    modifier onlyPartners(){
        require(msg.sender == provider || msg.sender == customer || msg.sender == providerContract, "OnlyPartners!");
        _;
    }

    modifier onlyProvider(){
        require(msg.sender == provider || msg.sender == providerContract, "OnlyProvider!");
        _;
    }

    function setSla(
        uint _metric,
        uint _highGoal,
        uint _middleGoal,
        uint _refundMiddle,
        uint _refundLow
    ) public onlyPartners {
        require(!slaSet, "SLA cannot be set again!");
        sla = [_metric, _highGoal, _middleGoal, _refundMiddle, _refundLow];
        slaSet = true;
    }

    function setServiceDetails(
        uint _cpu,
        uint _ram,
        uint _traffic,
        uint _ssd) public onlyPartners {
        require(!specsSet);
        specs = [_cpu, _ram, _traffic, _ssd];
        specsSet = true;
    }

    function setActive(bool _state) internal {
        if (isActive != _state) emit ContractStateChanged(_state);
        isActive = _state;
    }

    function deposit() public payable returns (uint){
        require(msg.value >= costPerDay, "Deposit > costPerDay is required!");
        if (!isActive) setActive(true);
        return address(this).balance;
    }

    function calculatePenalty(uint _achievedServiceQuality) public view returns (uint){
        require(slaSet, "SLA has not been set yet, cannot calculate quality");
        uint penalty = sla[4];
        //default: set penalty to refundLow (achieved 0% - middleGoal)
        if (_achievedServiceQuality >= sla[2]) penalty = sla[3];
        //set penalty to refundMiddle (achieved middleGoal - highGoal)
        if (_achievedServiceQuality >= sla[1]) penalty = 0;
        // SLA was adhered to -> no penalty
        //emit PenaltyCalculated(_achievedServiceQuality, penalty);
        return penalty;
    }

    //required for truffle testing
    function() public payable {}

    /*function getAll() public view onlyPartners returns (address, address, address, string, string, uint, uint[], uint[]){
        return (provider, customer, providerContract, customerPublicKey, name, costPerDay, ServiceDetailsToArray(specs), SLAPolicyToArray(sla));
    }*/

    function setProvider() public {
        provider = msg.sender;
    }


}