var ServiceContract = artifacts.require("./ServiceContract.sol");

contract("ServiceContract", async (accounts) => {
    /*it("should prevent setting SLA twice", function () {
        let addr = "0xca35b7d915458ef540ade6068dfe2f44e8fa733c";
        return  ServiceContract.new(addr, addr, addr, "pubKey", "vServerS", 30).then(function (instance){
            serviceContract = instance;
            serviceContract.setSla(0, 99, 95, 15, 100);
            assert.equal(serviceContract.setSla(0, 99, 95, 15, 100), false, "Setting SLA a second time should return false!");
        })
    });*/
    it("should calculate 7 days of contract duration", async () => {
        let pricePerDay = 8;
        let addr = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
        let contract = await ServiceContract.new(addr, accounts[0], addr, "pubKey", "vServers", pricePerDay);
        await contract.send(pricePerDay * 8);
        //console.log("Today: " + ~~(Date.now() / 1000) + "\nYesterday: " + ~~((Date.now() / 1000) - 87000));
        await contract.updateLastCalculationDate((Date.now() / 1000) - 87000);
        //console.log("Balance: " + await web3.eth.getBalance(contract.address));

        await contract.recalculateServiceDuration();
        let useableCustomerFunds = (await contract.useableCustomerFunds.call());
        //console.log("Customer Funds: " + useableCustomerFunds);

        assert.equal(useableCustomerFunds, pricePerDay * 7, "Contract did not receive 56 wei");

        let endDate = new Date(await contract.getEndDate().valueOf() * 1000);
        let now = new Date(Date.now());
        let sevenDays = 60 * 60 * 24 * 7;
        let diff = (endDate - now) / 1000;


        /*console.log("endDate:\t" + endDate + "\nnow:\t\t" + now);
        console.log("Difference:\t" + diff + "\n\t\t\t" + sevenDays);*/
        assert.approximately(diff, sevenDays, 10, "Calculated endDate is not correct!");
    });

    it("should reserve the payout amount for the provider", async () => {
        /*
        1) create contract
        2) assert endDate = 0 (has not been set)
        3) transfer funds to contract
        4) set last updated to 1 day back
        5) calculate Service Duration
        6) assert if Withdrawable for Provider == cost for one day
         */
        let pricePerDay = 8;
        let contract = await ServiceContract.new(accounts[0], accounts[0], accounts[0], "pubKey", "vServers", pricePerDay);
        let endDate = await contract.getEndDate();
        assert.equal(endDate, 0, "EndDate should be 0!");
        await contract.send(pricePerDay * 8);
        await contract.updateLastCalculationDate((Date.now() / 1000) - 87000);
        await contract.recalculateServiceDuration();
        let withdrawableForProvider = await contract.getWithdrawableForProvider();
        assert.equal(withdrawableForProvider, pricePerDay, "Provider should be able to withdraw cost of one day (8)");

    });
});