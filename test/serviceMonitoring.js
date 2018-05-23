var ServiceMonitoring = artifacts.require("./ServiceMonitoring.sol");

contract("ServiceMonitoring", async (accounts) => {
    it("should calculate 60% availability", async () => {
        let monitor = await ServiceMonitoring.new();
        let now = new Date(Date.now()) / 1000;
        let hourInSeconds = 3600;
        for (let i = 17; i > 0; i--) {
            await monitor.testHeartbeat(now - i * hourInSeconds);
        }
    });
    it("should empty heartbeat array on reset", async () => {
        let monitor = await ServiceMonitoring.new();
        let now = new Date(Date.now()) / 1000;
        let hourInSeconds = 3600;
        for (let i = 17; i > 0; i--) {
            await monitor.testHeartbeat(now - i * hourInSeconds);
        }
        assert.equal(await monitor.getHeartbeats().length, 17, "There should be 17 heartbeats!");
        // now resetting the array
        await monitor.resetHeartbeats();
        assert.equal(await monitor.getHeartbeats().length, 0, "There should be 0 heartbeats!");
    });
});
