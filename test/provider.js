var Provider = artifacts.require("Provider");

contract('Provider', function (accounts) {
    it("should create a provider contract named \"myProvider\"", function () {
        return Provider.deployed().then(function (instance) {
            return instance.name.call();
        }).then(function (name) {
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
});