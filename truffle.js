module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    migrations_directory: "./migrations",
    //contracts_build_directory: "./src/contracts",
    networks: {
        development: {
            host: "localhost",
            port: 9545,
            network_id: "*", // Match any network id
            gas: 4712388,
            gasPrice: 30660000000
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 500
        }
    }
};
