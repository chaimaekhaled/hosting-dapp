pragma solidity ^0.4.21;

/*
    This file contains the ServiceDatabase smart contract that provides all necessary data, modifiers and events for
    the Service smart contract.
*/
contract ServiceDatabase {

    event LogNumber(uint n);
    event Log(string text);
    event LogBytes(bytes32 hash);
    event LogAddress(address addr);
    event LogUintArray(uint[] uintArr);
    event ContractStateChanged(bool isActive);
    event PenaltyCalculated(uint quality, uint penalty);
    event ContractEndDateUpdated(uint date);
    event WithdrawalForProviderChanged(uint amount);

    // Roles & identities
    address provider;
    address customer;
    address monitoringAgent; // allows this address to add performance data via state channel logic
    address providerContract; // reference back to the Provider smart contract
    string customerPublicKey; // not really required as not utilized. could be used to automate server deployment

    // Service meta information
    string name; // name of the service
    uint serviceId; // ID of the service contract
    uint productId; // ID of the service offering (product) underlying this service
    uint[] specs; // specs of the server [cpu, ram, traffic, ssd]
    uint[] sla; // SLA of the service [metric, highGoal, middleGoal, refundMiddle, refundLow]

    // Service contract information
    bool isActive = false;
    uint startDate = now; // start date of the contract (set on creation)
    uint endDate = now; // time until the service is active (can be changed by changeContractDuration())
    uint costPerDay;

    // Billing
    uint withdrawableForProvider; // service fee that is withdrawable for the provider
    uint lastBillDate = now; // date when the last payout for provider was calculated.
    uint[] availabilityHistory; // array containing the availability measurements (one per day)
    mapping(bytes32 => address) signatures; // mapping of signatures for state channel logic

    // Flag to prevent SLA and Specs to be changed after they have been set
    bool slaSet = false;
    bool specsSet = false;

    modifier onlyPartners(){
        require(msg.sender == provider || msg.sender == customer || msg.sender == providerContract, "OnlyPartners!");
        _;
    }

    modifier onlyProvider(){
        require(msg.sender == provider || msg.sender == providerContract, "OnlyProvider!");
        _;
    }

    //required for truffle testing
    function() public payable {}

}