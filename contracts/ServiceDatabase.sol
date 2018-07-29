// TODO: convert between ether and wei!

pragma solidity ^0.4.21;

//import "./Hosting.sol";

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
    address monitoringAgent;
    address providerContract;
    string customerPublicKey; // not really required as not utilized.

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

    //required for truffle testing
    function() public payable {}

}