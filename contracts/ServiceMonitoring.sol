pragma solidity ^0.4.21;

import "./ServiceContract.sol";
import "./Hosting.sol";

contract ServiceMonitoring is ServiceContract {

    event heartbeatReceived(uint timestamp);
    event availabilityForDay(uint start, uint val);

    uint[] heartbeats;
    uint[] availabilityHistory;

    function getHeartbeats() public view returns (uint[]){
        return heartbeats;
    }

    function heartbeat() public {
        uint beat = now;
        heartbeats.push(beat);
        //        heartbeatArchive.push(beat);
        //        emit heartbeatReceived(beat);
    }

    function resetHeartbeats() public {
        uint[] memory empty;
        heartbeats = empty;
    }

    /*
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
        uint availability = (counterTimestamp * 100) / totalHours;
        return availability;
    }
    */

    function calculateServiceLevelPerDay() public returns (uint){
        uint _start = startDay + availabilityHistory.length * 1 days;
        uint _end = _start + 1 days;
        require(_start > 0, "Start is <= 0!");
        require(_end > 0, "End is <= 0!");

        uint counterTimestamp = 0;

        // count how often a heartbeat was received during this 24h period
        while (counterTimestamp < heartbeats.length && heartbeats[counterTimestamp] < _end) {
            counterTimestamp++;
        }
        uint availability = (counterTimestamp * 100) / 24;

        // Refresh heartbeats array to exclude those timestamps that where already processed
        uint i = counterTimestamp;
        uint[] memory newArray = new uint[](heartbeats.length - i);
        uint x = 0;
        while (i < heartbeats.length) {
            newArray[x] = heartbeats[i];
            x++;
        }
        heartbeats = newArray;
        emit availabilityForDay(_start, availability);
        return availability;
    }

    function getStartDay() public view onlyPartners returns (uint){
        return startDay;
    }

    function getAvailabilityHistory() public view onlyPartners returns (uint[]){
        return availabilityHistory;
    }

    //TODO Remove for prod
    function testHeartbeat(uint _timestamp) public {
        uint beat = _timestamp;
        heartbeats.push(beat);
        //        heartbeatArchive.push(beat);
        //        emit heartbeatReceived(beat);
    }
    //TODO Remove for prod
    function testSetStartDay(uint _start) public {
        startDay = _start;
    }
}
