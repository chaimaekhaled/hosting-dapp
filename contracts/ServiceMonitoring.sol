pragma solidity ^0.4.19;

import "./ServiceContract.sol";
import "./Hosting.sol";

contract ServiceMonitoring is ServiceContract {
    event heartbeatReceived(uint timestamp);

    uint[] heartbeats;
    uint[] heartbeatArchive;

    function getHeartbeats() external view returns (uint[]){
        return heartbeats;
    }

    function heartbeat() public {
        uint beat = now;
        heartbeats.push(beat);
        heartbeatArchive.push(beat);
        emit heartbeatReceived(beat);
    }

    function testHeartbeat(uint _timestamp) public {
        uint beat = _timestamp;
        heartbeats.push(beat);
        heartbeatArchive.push(beat);
        emit heartbeatReceived(beat);
    }

    function resetHeartbeats() external {
        uint[] memory empty;
        heartbeats = empty;
    }


    function calculateServiceLevel(uint _start, uint _end) external returns (uint){
        uint totalHours = (_end - _start) / 1 hours;
        uint counterTimestamp;
        for (uint i = heartbeatArchive.length; heartbeatArchive[i] > _start; i++) {
            counterTimestamp++;
        }
        uint availability = (counterTimestamp * 100) / totalHours;
        return availability;
    }

}
