pragma solidity ^0.4.0;

import "./ServiceContract.sol";

contract ServiceBilling is ServiceContract {
    event ContractEndDateUpdated(uint date);
    event useableCustomerFundsEvent(uint forCustomer);
    event ContractCalculationUpdated(uint time);

    // Billing
    uint endDate; // time until the service is active
    uint lastCalculationDate; // Date when the costs have been calculated last and service has been paid
    uint withdrawableForProvider; // service fee that is withdrawable for the provider

    constructor(address _provider, address _customer, address _providerContract, string _customerPublicKey, string _name, uint _costPerDay) ServiceContract(_provider, _customer, _providerContract, _customerPublicKey, _name, _costPerDay) public payable {
        provider = _provider;
        customer = _customer;
        providerContract = _providerContract;
        customerPublicKey = _customerPublicKey;
        name = _name;
        costPerDay = _costPerDay;
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
        uint daysSinceLastUpdate = (now - lastCalculationDate) / 1 days;
        //uint daysSinceLastUpdate = 1;
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
        emit ContractCalculationUpdated(_date);
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
}
