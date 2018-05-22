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
        let addr = "0xca35b7d915458ef540ade6068dfe2f44e8fa733c";
        let contract = await ServiceContract.new(addr, accounts[0], addr, "pubKey", "vServers", pricePerDay);
        await contract.send(pricePerDay * 7);
        let balance = await web3.eth.getBalance(contract.address);
        /*console.log("Contract Address: " + (contract.address)
            + "\nContract Balance: " + balance);*/
        contract.recalculateServiceDuration();
        assert.equal(balance, pricePerDay * 7, "Contract did not receive 56wei");

        let endDate = new Date(await contract.getEndDate().valueOf() * 1000);
        let now = new Date(Date.now());
        let sevenDays = 60 * 60 * 24 * 7;
        let diff = (endDate - now) / 1000;
        /*console.log("endDate:\t" + endDate + "\nnow:\t\t" + now);
        console.log("Difference:\t" + diff + "\n\t\t\t" + sevenDays);*/
        assert.approximately(diff, sevenDays, 10, "Calculated endDate is not correct!");
    })
});