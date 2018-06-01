pragma solidity ^0.4.21;

import "./ServiceBilling.sol";

contract Service is ServiceBilling {

    constructor(
        uint _serviceId,
        address _provider,
        address _customer,
        address _providerContract,
        string _customerPublicKey,
        string _name,
        uint _costPerDay,
        uint _productId)
    public payable {
        serviceId = _serviceId;
        provider = _provider;
        customer = _customer;
        providerContract = _providerContract;
        customerPublicKey = _customerPublicKey;
        name = _name;
        costPerDay = _costPerDay;
        productId = _productId;
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
        startDay,
        address(this),
        name);
    }

    //TODO Remove for prod

    function setMockData(
        uint _endDate,
        uint[] _availabilities,
        uint _startDate)
    public {
        endDate = _endDate;
        //        for(uint i = 0; i < _availabilities.length;i++){
        //            availabilityHistory.push(_availabilities[i]);
        //        }
        availabilityHistory = _availabilities;
        startDay = _startDate;
    }

}
/*
"0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","pubKey","vServerSmall", 2
*/