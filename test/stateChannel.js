var Service = artifacts.require("./Service.sol");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

contract("Service", async (accounts) => {

    const outputTx = (tx) => {
        for (let i = 0; i < tx.logs.length; i++) {
            switch (tx.logs[i].event) {
                case "LogBytes":
                    console.log("LogBytes: " + tx.logs[i].args.hash);
                    break;
                case "LogNumber":
                    console.log("LogNumber: " + tx.logs[i].args.n.c[0]);
                    break;
                case "LogUintArray":
                    console.log("LogUintArray: " + tx.logs[i].args.uintArr);
                    break;
                case "LogAddress":
                    console.log("LogAddress: " + tx.logs[i].args.addr);
                    break;
                case "Log":
                    console.log("Log: " + tx.logs[i].args.text);
                    break;
                default:
                    console.log(tx.logs[i].args);
                    break;
            }
        }
    };

    const createContract = async () => {
        let contract = await Service.new(1, provider.address, customer.address, accounts[2], accounts[0],
            "pubKey", "vServers", pricePerDay, 0);
        //console.log(contract.address, "\n", 1, provider.address, customer.address, accounts[2], accounts[0],
        //    "pubKey", "vServers", pricePerDay, 0);
        await contract.changeContractDuration(1, {value: 10 * pricePerDay});
        await contract.setSla(0, 99, 95, 15, 100);
        await contract.setServiceDetails(1, 2, 10, 20);
        let newStartDate = new Date(await contract.getStartDate().valueOf() * 1000 - 3 * 86400000);
        let newEndDate = new Date(await contract.getEndDate().valueOf() * 1000 - 3 * 86400000);
        //console.log(newStartDate);
        //console.log(newEndDate);
        newStartDate = newStartDate / 1000;
        newEndDate = newEndDate / 1000;
        await contract.setMockData(newEndDate, [], newStartDate, newStartDate);
        //console.log("Account addresses:");
        //console.log(await contract.getParticipants.call());
        return contract;
    };

    let address = accounts[0];
    let pricePerDay = 8;
    let monitoringData = [55, 99];
    let customer = {
        v: 0,
        r: 0,
        s: 0,
        address: accounts[1],
    };
    let provider = {
        v: 0,
        r: 0,
        s: 0,
        address: accounts[0],
    };

    /*it('ecrecover result matches address', async function () {
        var instance = await Service.new(1, provider.address, customer.address, accounts[2], accounts[0],
            "pubKey", "vServers", pricePerDay, 0);
        let msg = 'I really did make this message';
        let prefix = "\x19Ethereum Signed Message:\n" + msg.length
        let h = web3.utils.sha3(prefix + msg)
        h  = web3.eth.accounts.hashMessage(msg);
        console.log(`sha3 hash ${h}`);

        let sig1 = await web3.eth.sign(msg, address);
        console.log(`signature: ${sig1}`)
        var sig = sig1.slice(2)
        var r = `0x${sig.slice(0, 64)}`
        var s = `0x${sig.slice(64, 128)}`
        var v = web3.utils.toDecimal(sig.slice(128, 130)) + 27

        var result = await instance.recoverAddr.call(h, v, r, s)
        console.log(`address: ${address}, result ${result}`)
        assert.equal(result, address)
    })*/

    it("should close the state channel successfully", async () => {
        /*let pricePerDay = 8;
        let monitoringData = [55, 99];
        let customer = {
            v: 0,
            r: 0,
            s: 0,
            address: accounts[1],
        };
        let provider = {
            v: 0,
            r: 0,
            s: 0,
            address: accounts[0],
        };*/
        let contract = await createContract();

        //let hash = web3.utils.soliditySha3({t: 'address', v: contract.address}, {t: 'uint[]', v: monitoringData});
        //let hash = web3.eth.accounts.hashMessage(msg);
        let hash = web3.utils.soliditySha3({t: 'address', v: contract.address}, {t: 'uint[]', v: monitoringData});


        let sig1 = await web3.eth.sign(hash, provider.address);
        let sig2 = await web3.eth.sign(hash, customer.address);
        // console.log(`signature: ${sig1}`);
        // console.log(`signature: ${sig2}`);
        let sigP = sig1.slice(2);
        provider.r = `0x${sigP.slice(0, 64)}`;
        provider.s = `0x${sigP.slice(64, 128)}`;
        provider.v = web3.utils.toDecimal(sigP.slice(128, 130)) + 27;
        let sigC = sig2.slice(2);
        customer.r = `0x${sigC.slice(0, 64)}`;
        customer.s = `0x${sigC.slice(64, 128)}`;
        customer.v = web3.utils.toDecimal(sigC.slice(128, 130)) + 27;
        /*
        await web3.eth.sign(hash, provider.address).then((signedHash) => {
            provider.r = signedHash.slice(0, 66);
            provider.s = '0x' + signedHash.slice(66, 130);
            provider.v = web3.utils.hexToNumber('0x' + signedHash.slice(130, 132));
            if (provider.v < 2) provider.v = provider.v + 27;
        });
        await web3.eth.sign(hash, customer.address).then((signedHash) => {
            customer.r = signedHash.slice(0, 66);
            customer.s = '0x' + signedHash.slice(66, 130);
            customer.v = web3.utils.hexToNumber('0x' + signedHash.slice(130, 132));
            if (customer.v < 2) customer.v = customer.v + 27;
        });
        */

        /*console.log("Provider: ");
        console.log(provider);
        console.log("Customer: ");
        console.log(customer);
        console.log("Hash: ");
        console.log(hash);
*/

        let tx = await contract.addAvailabilityData(hash, customer.v, customer.r, customer.s, monitoringData);
        //console.log(tx);
        //console.log("TX customer logs:");
        //outputTx(tx);

        let tx2 = await contract.addAvailabilityData(hash, provider.v, provider.r, provider.s, monitoringData);
        //console.log("TX 2 Provider logs");
        //outputTx(tx2);

        let availabilityHistory = await contract.getAvailabilityHistory.call().then(bn => bn.map(x => x.toNumber()));
        assert.equal(monitoringData.toString(), availabilityHistory.toString(), "AvailabilityHistory is not as expected!");
    });

    it("should call paymentToProvider and update the withdrawableForProvider.", async () => {
        let contract = await createContract();
        //console.log("My contracts address");
        //console.log(contract.address);
        // assert monitoringData = getAvailabilityHistory
        let txpaymentToProvider = await contract.paymentToProvider(monitoringData);
        //console.log("Result of paymentToProvider");
        //console.log(txpaymentToProvider);
        let availabilityHistory = await contract.getAvailabilityHistory.call().then(bn => bn.map(x => x.toNumber()));
        //availabilityHistory = availabilityHistory.map(x => x.toNumber());
        //console.log("Result of getAvailabilityHistory");
        //console.log(availabilityHistory);
        let withdrawableForProvider = await contract.getWithdrawableForProvider.call().then(x => x.toNumber());
        //console.log(withdrawableForProvider);
        assert.equal(monitoringData.toString(), availabilityHistory.toString(), "AvailabilityHistory is not as expected!");
    });


});