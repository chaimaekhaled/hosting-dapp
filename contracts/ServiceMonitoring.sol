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

    function calculateServiceLevel(uint _start, uint _end) public view returns (uint){
        require(_start > 0, "Start is <= 0!");
        require(_end > 0, "End is <= 0!");
        require(_start < _end, "Start < end!");

        uint totalHours = (_end - _start) / 1 hours;
        uint counterTimestamp = 0;
        //uint i = heartbeatArchive.length - 1;
        //emit LogNumber(totalHours);
        //emit LogNumber(i);
        for (uint n = 0; n < heartbeatArchive.length; n++) {
            uint ts = heartbeatArchive[n];
            if (ts > _start && ts < _end) {
                //emit LogNumber(ts);
                counterTimestamp++;
            }
        }
        /*for (i; heartbeatArchive[i] > _start && i >= 0; i--) {
            //counterTimestamp = counterTimestamp + 1;
            emit LogNumber(heartbeatArchive[i]);
        }*/
        uint availability = (counterTimestamp * 100) / totalHours;
        return availability;
    }
}
