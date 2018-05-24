var ServiceMonitoring = artifacts.require("./ServiceMonitoring.sol");

contract("ServiceMonitoring", async (accounts) => {
    it("should calculate 60% availability", async () => {
        let monitor = await ServiceMonitoring.new();
        let now = new Date(Date.now()) / 1000;
        let hourInSeconds = 3600;
        for (let i = 17; i > 0; i--) {
            await monitor.testHeartbeat(now - i * hourInSeconds);
        }
        let serviceLevelTX = await monitor.calculateServiceLevelPerDay.call(); //now - 24 * hourInSeconds, now + 1000
        let serviceLevel = serviceLevelTX.c[0];
        assert.approximately(serviceLevel, 70, 2, "ServiceLevel not 70%!");
    });

    it("should empty heartbeat array on reset", async () => {
        let monitor = await ServiceMonitoring.new();
        let now = new Date(Date.now()) / 1000;
        let hourInSeconds = 3600;
        for (let i = 17; i > 0; i--) {
            await monitor.testHeartbeat(now - i * hourInSeconds);
        }
        let hb = await monitor.getHeartbeats();
        //console.log("Heartbeats: " + hb + "  | Type: " + typeof hb + " | Len: " + hb.length);
        assert.equal(hb.length, 17, "There should be 17 heartbeats!");
        // now resetting the array
        await monitor.resetHeartbeats();
        let hb2 = await monitor.getHeartbeats();
        //console.log("Heartbeats2: " + hb2 + "  | Type: " + typeof hb2 + " | Len: " + hb2.length);
        assert.equal(hb2.length, 0, "There should be 0 heartbeats!");
    });

});
