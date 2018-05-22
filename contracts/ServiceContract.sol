// TODO: convert between ether and wei!

pragma solidity ^0.4.19;
//pragma experimental ABIEncoderV2;

import "./Hosting.sol";

contract ServiceContract is Hosting {

    event LogNumber(uint n);
    event Log(string text);
    event ContractEndDateUpdated(uint date);
    event useableCustomerFundsEvent(uint forCustomer);

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
        require(!slaSet, "SLA cannot be set again!");
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

    //required for truffle testing
    function() external payable {

    }

    function withdraw(uint _amount) public onlyPartners {
        // Transfers contract funds to customer's address
        require(_amount <= (address(this).balance - withdrawableForProvider));
        customer.transfer(_amount);
    }

    function withdrawProvider() public onlyProvider {
        // Transfers payout to provider
        msg.sender.transfer(withdrawableForProvider);
    }

    function recalculateServiceDuration() public {
        // Restrict to daily contract updates for easier payout calculation;
        //uint daysSinceLastUpdate = (now - lastCalculationDate) / 1 days;
        uint daysSinceLastUpdate = 1;
        emit LogNumber(daysSinceLastUpdate);
        require(daysSinceLastUpdate >= 1);

        uint earningsProviderSinceLastUpdate = costPerDay * daysSinceLastUpdate;
        withdrawableForProvider += earningsProviderSinceLastUpdate;

        uint newDurationInDays = 1 days * (useableCustomerFunds() / costPerDay);
        endDate = now + newDurationInDays;
        updateLastCalculationDate(now);

        emit ContractEndDateUpdated(endDate);
    }

    function useableCustomerFunds() public onlyPartners returns (uint){
        uint forCustomer = (address(this).balance - withdrawableForProvider);
        //emit useableCustomerFundsEvent(forCustomer);
        return forCustomer;
    }

    //TODO make private after testing!
    function updateLastCalculationDate(uint _date) public {
        emit LogNumber(_date);
        lastCalculationDate = _date;
    }

    function getEndDate() public view onlyPartners returns (uint){
        return endDate;
    }

    function getBalance() public view onlyPartners returns (uint){
        return address(this).balance;
    }

    function getWithdrawableForProvider() public view onlyProvider returns (uint){
        return withdrawableForProvider;
    }

    function getAll() public view onlyPartners returns (address, address, address, string, string, uint, uint[], uint[]){
        return (provider, customer, providerContract, customerPublicKey, name, costPerDay, ServiceDetailsToArray(specs), SLAPolicyToArray(sla));
    }


}