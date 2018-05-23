pragma solidity ^0.4.21;

import "./ServiceContract.sol";
import "./Hosting.sol";

contract ServiceMonitoring is ServiceContract {

    event heartbeatReceived(uint timestamp);

    uint[] heartbeats;
    uint[] heartbeatArchive;

    function getHeartbeats() public view returns (uint[]){
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

    function resetHeartbeats() public {
        uint[] memory empty;
        heartbeats = empty;
    }

    function calculateServiceLevel(uint _start, uint _end) public view onlyPartners returns (uint){
        require(_start > 0 && _end > 0 && _start < _end, "Parameters are invalid!");
        uint totalHours = (_end - _start) / 1 hours;
        uint counterTimestamp;
        for (uint i = heartbeatArchive.length; heartbeatArchive[i] > _start; i++) {
            counterTimestamp++;
        }
        require(false, "Line 44");
        uint availability = (counterTimestamp * 100) / totalHours;
        require(false, "line 45");
        return availability;
    }
}
