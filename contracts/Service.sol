pragma solidity ^0.4.21;

import "./ServiceLogic.sol";

/*
    This file contains the Service smart contract, that inherits ServiceLogic, which in turn inherits ServiceDatabase
    . This Service smart contract offers the constructor, getter, setter, and helping functions for Service contracts.
*/

contract Service is ServiceLogic {

    /*
    Example for parameters of the constructor:

    1,"0xf17f52151ebef6c7334fad080c5704d77216b732","0x627306090abab3a6e1400e9345bc60c78a8bef57","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","0xca35b7d915458ef540ade6068dfe2f44e8fa733c","pubKey","vServerSmall", 2, 0
*/

    constructor(
        uint _serviceId, // ID of this service contract
        address _provider,
        address _customer,
        address _monitoringAgent,
        address _providerContract,
        string _customerPublicKey,
        string _name,
        uint _costPerDay,
        uint _productId) // ID of the service offering
    public {
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



    // This function returns this contract's data
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

    function getStartDate() public view onlyPartners returns (uint){
        return startDate;
    }

    function getEndDate() public view onlyPartners returns (uint){
        return endDate;
    }

    function getBalance() public view onlyPartners returns (uint){
        return address(this).balance;
    }

    function getAvailabilityHistory() public view onlyPartners returns (uint[]){
        return availabilityHistory;
    }

    function getWithdrawableForProvider() public view onlyProvider returns (uint){
        return withdrawableForProvider;
    }

    function useableCustomerFunds() public view onlyPartners returns (uint){
        return address(this).balance - withdrawableForProvider;
    }


    /*
        setSla is called by the provider contract when a service is bought. this is to require less parameters in the
        constructor. We sadly cannot use structs as parameters, as this was an experimental feature at the time of
        development and deemed as too risky.
    */
    function setSla(
        uint _metric,
        uint _highGoal,
        uint _middleGoal,
        uint _refundMiddle,
        uint _refundLow
    ) public onlyProvider {
        require(!slaSet, "SLA cannot be set again!");
        sla = [_metric, _highGoal, _middleGoal, _refundMiddle, _refundLow];
        slaSet = true;
    }

    /*
        setServiceDetails is called by the provider contract when a service is bought. this is to require less
        parameters in the constructor. We sadly cannot use structs as parameters, as this was an experimental feature
        at the time of development and deemed as too risky.
    */
    function setServiceDetails(
        uint _cpu,
        uint _ram,
        uint _traffic,
        uint _ssd) public onlyProvider {
        require(!specsSet);
        specs = [_cpu, _ram, _traffic, _ssd];
        specsSet = true;
    }



    // recoverAddr is used for state channel functionality. It allows the validation of the input parameters
    function recoverAddr(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        return ecrecover(msgHash, v, r, s);
    }

    // TODO remove for produtive use
    /*
        Remove setProvider for productive use. It's useful for development and testing.
    */
    function setProvider() public {
        provider = msg.sender;
    }

    //TODO Remove for productive use
    /*
     this helper function serves development purposes and should be removed for productive use
     it allows to "fake" the startDate, endDate, date of last bill calculation and the array of service performance
     measurements
    */
    function setMockData(
        uint _endDate,
        uint[] _availabilities,
        uint _startDate,
        uint _lastBillDate)
    public {
        endDate = _endDate;
        availabilityHistory = _availabilities;
        startDate = _startDate;
        lastBillDate = _lastBillDate;
    }

}
