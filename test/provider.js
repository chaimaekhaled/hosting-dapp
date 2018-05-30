var Provider = artifacts.require("Provider");

contract('Provider', function (accounts) {
    it("should create a provider contract named \"myProvider\"", function () {
        return Provider.deployed()
            .then((instance) => {
                instance.setName('myProvider');
                return instance.name.call();
            })
            .then((name) => {
                console.log("Should be myProvider:\t" + name);
                assert.equal(name, "myProvider", "Provider name is not \"myProvider\"!");
            })
    });
    it("should add a product", function () {
        return Provider.deployed().then(function (instance) {
            provider = instance;
            return provider.addProduct("vServerBig", 30, [4, 16, 100, 200], [0, 99, 92, 20, 95]);
        }).then(function () {
            return provider.getProduct(0);
        }).then(function (product) {
            assert.equal(product[0], "vServerBig", "Product name is not 'vServerBig'!");
            assert.equal(product[3], 30, "Product pricePerDay is not 30!");
            assert.equal(product[4].toString(), "4,16,100,200", "Product specs are not as expected!");
            assert.equal(product[5].toString(), "0,99,92,20,95", "Product SLA is not as expected!");
        })
    });
    it("should buy a product", async () => {
        let provider = await Provider.deployed();
        await provider.addProduct("vServerBig", 30, [4, 16, 100, 200], [0, 99, 92, 20, 95]);
        let NewProductBought = provider.NewProductBought({serviceContract: 0});
        let customerServiceContract;

        NewProductBought.watch(function (error, result) {
            console.log("Event triggered");
            if (!error) {
                customerServiceContract = result.args.serviceContract;
            }
        });

        await provider.buyService(0, "pubKey", {from: accounts[1]});


        // console.log("CustomerServiceContract:");
        // console.log(customerServiceContract);
        // console.log("TX Logs");
        // console.log(customerServiceContract.logs[1].args.serviceContract);
        let customerAllContracts = (await provider.getAllContractsOfCustomer.call(accounts[1]));
        // console.log("AllContract");
        // console.log(customerAllContracts);
        assert.equal(customerServiceContract, customerAllContracts[0], "Error in customer contract buying!");
    });
    it("should buy a product with payable", async () => {
        let expectedValue = 1000;
        let provider = await Provider.deployed();
        await provider.addProduct("vServerBig", 30, [4, 16, 100, 200], [0, 99, 92, 20, 95]);
        let NewProductBought = provider.NewProductBought({serviceContract: 0});
        let MsgValue = provider.MsgValue({value: 1337});
        let customerServiceContract;

        NewProductBought.watch(function (error, result) {
            if (!error) {
                customerServiceContract = result.args.serviceContract;
            }
        });
        MsgValue.watch(function (error, result) {
            if (!error) {
                console.log("Msg Value: " + result.args.value);
            }
        });

        await provider.buyService(0, "pubKey", {from: accounts[1], value: expectedValue});


        // console.log("CustomerServiceContract:");
        // console.log(customerServiceContract);
        // console.log("TX Logs");
        // console.log(customerServiceContract.logs[1].args.serviceContract);
        let customerAllContracts = (await provider.getAllContractsOfCustomer.call(accounts[1]));
        // console.log("AllContract");
        // console.log(customerAllContracts);
        assert.equal(customerServiceContract, customerAllContracts[customerAllContracts.length - 1], "Error in customer contract buying!");

        let serviceBalance = await web3.eth.getBalance(customerServiceContract);
        assert.equal(serviceBalance, expectedValue, "Balance of serviceContract is not as expected");
    })

});