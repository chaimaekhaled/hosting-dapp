const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

console.log(web3.version);
const keyStore = {
    "address": "646b73da81dc0cd1d64dc339e24e6fcf3dc16c19",
    "crypto": {
        "cipher": "aes-128-ctr",
        "ciphertext": "ece51d13851b25db0759d034f9c905da7cc5042a37a132d7a8894a8fa93edbf8",
        "cipherparams": {"iv": "7d7189f2c2c59a5dc37229b60f5625aa"},
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "n": 262144,
            "p": 1,
            "r": 8,
            "salt": "c90d81f5aa66abca431c1febf467289b25d7d34cbce9db367b148a2d20672ad6"
        },
        "mac": "72c84a0c06c1b554c197a96637c0eabf3d7b254744b9f14646176ef0fa314134"
    },
    "id": "f39f276e-58e4-4c0a-85be-fcccf17cb8a2",
    "version": 3
};

const decryptedAccount = web3.eth.accounts.decrypt(keyStore, "asdf1");
console.log(decryptedAccount);

// then try some requests
web3.eth.getBlockNumber(console.log);
web3.eth.getAccounts(async (error, accounts) => {
    console.log(accounts);
    // web3.eth.sendTransaction({
    //     from: '0x646b73da81dc0cd1d64dc339e24e6fcf3dc16c19',
    //     to: '0x72b6a1f67e7d8c39a44e3ea3f66944c881031c49',
    //     value: web3.utils.toWei("0.5", "ether")
    // }).then(receipt => console.log(receipt))
    console.log(await web3.eth.getBalance(accounts[0]));
    console.log(await web3.eth.getBalance(accounts[1]));
    web3.eth.personal.sign("myData", "0x646b73da81dc0cd1d64dc339e24e6fcf3dc16c19", "asdf1").then(signedData => console.log(signedData))
});

/*
// run geth:
geth --testnet --syncmode="light" --rpc --rpcapi="db,eth,net,web3,personal,web3" --rpccorsdomain moz-extension://c73a460a-a578-4111-b320-8f3299cca995,chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn

// unlock accounts:
personal.unlockAccount("0x646b73da81dc0cd1d64dc339e24e6fcf3dc16c19", "asdf1", 0);
personal.unlockAccount("0x72b6a1f67e7d8c39a44e3ea3f66944c881031c49", "asdf2", 0);

// function to return balance of each account:
function checkAllBalances() {
    var totalBal = 0;
    for (var acctNum in eth.accounts) {
        var acct = eth.accounts[acctNum];
        var acctBal = web3.fromWei(eth.getBalance(acct), "ether");
        totalBal += parseFloat(acctBal);
        console.log("  eth.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal + " ether");

    }
};

// Transfer some ether
eth.sendTransaction({
        from: '0x646b73da81dc0cd1d64dc339e24e6fcf3dc16c19',
        to: '0x72b6a1f67e7d8c39a44e3ea3f66944c881031c49',
        value: web3.toWei(0.5, "ether")
    })


// Faucet
curl -X POST  -H "Content-Type: application/json" -d '{"toWhom":"0x646b73da81dc0cd1d64dc339e24e6fcf3dc16c19"}' https://ropsten.faucet.b9lab.com/tap

*/