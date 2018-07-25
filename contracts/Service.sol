pragma solidity ^0.4.21;

import "./ServiceBilling.sol";

contract Service is ServiceBilling {

    constructor(
        uint _serviceId,
        address _provider,
        address _customer,
        address _monitoringAgent,
        address _providerContract,
        string _customerPublicKey,
        string _name,
        uint _costPerDay,
        uint _productId)
    public payable {
        serviceId = _serviceId;
        provider = _provider;
        customer = _customer;
        monitoringAgent = _monitoringAgent;
        providerContract = _providerContract;
        customerPublicKey = _customerPublicKey;
        name = _name;
        costPerDay = _costPerDay;
        productId = _productId;
    }

    function getParticipants() public view returns (address, address, address){
        return (customer, provider, monitoringAgent);
    }


    function getData() public view onlyPartners
    returns (uint[], uint, uint, uint, uint, uint, uint[], uint, address, string){
        return (
        availabilityHistory,
        useableCustomerFunds(),
        costPerDay,
        endDate,
        serviceId,
        productId,
        sla,
        startDate,
        address(this),
        name);
    }

    //TODO Remove for prod

    function setMockData(
        uint _endDate,
        uint[] _availabilities,
        uint _startDate,
        uint _lastBillDate)
    public {
        endDate = _endDate;
        //        for(uint i = 0; i < _availabilities.length;i++){
        //            availabilityHistory.push(_availabilities[i]);
        //        }
        availabilityHistory = _availabilities;
        startDate = _startDate;
        lastBillDate = _lastBillDate;
    }

    function calcHash(string _prefix, address _addr, uint[] _data) public returns (bytes32){
        bytes32 hash = keccak256(abi.encodePacked(_prefix, _addr, _data));
        emit LogBytes(hash);
        return hash;
    }

    function recoverAddr(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        return ecrecover(msgHash, v, r, s);
    }
}
/*
1,"0xf17f52151ebef6c7334fad080c5704d77216b732","0x627306090abab3a6e1400e9345bc60c78a8bef57","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","pubKey","vServerSmall", 2, 0

*/
