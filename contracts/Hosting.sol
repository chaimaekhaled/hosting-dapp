pragma solidity ^0.4.21;
//pragma experimental ABIEncoderV2;

library Hosting {
    //DELenum Metrics {Availability}
    //string[] constant Metrics = ["Availability"];


    // ServiceOffer is a product of a provider (such as a Small V-Server)
    struct ServiceOffer {
        string name; //name will be used for the Products Mapping
        uint id;
        uint costPerDay; // month has 30 days
        uint[] specs;
        //DELServiceDetails specs;
        uint[] sla;
        //DELSLAPolicy sla;
    }

    // SLAPolicy contains metrics with goals and refundpolicy
    struct SLAPolicy {
        //DELMetrics metric;
        uint metric; //since only availability is implemented, this is not required anymore;
        uint highGoal; // >= implemented!
        uint middleGoal; // >= implemented!
        uint refundMiddle;
        uint refundLow;
    }

    struct ServiceDetails {
        //uint _cpu, uint _ram, uint _traffic, uint _ssd
        uint cpu; //count of vCPUs
        uint ram; //in GB
        uint traffic; //in TB
        uint ssd; // in GB
    }
    /*
       function ServiceDetailsToVars(uint[] _details) public pure returns (uint, uint, uint, uint){
           return (_details[0], _details[1], _details[2], _details[3]);
           //return (_details.cpu, _details.ram, _details.traffic, _details.ssd);
       }

          function ServiceDetailsToArray(uint[] _details) public pure returns (uint[]){
               uint[] memory arr = new uint[](4);
               arr[0] = _details.cpu;
               arr[1] = _details.ram;
               arr[2] = _details.traffic;
               arr[3] = _details.ssd;
               return arr;
           }


    function SLAPolicyToVars(uint[] _slaPolicy) public pure returns (uint, uint, uint, uint, uint){
        return (_slaPolicy[0], _slaPolicy[1], _slaPolicy[2], _slaPolicy[3], _slaPolicy[4]);
    }

        function SLAPolicyToArray(uint[] _slaPolicy) public pure returns (uint[]){
            uint[] memory arr = new uint[](5);
            arr[0] = uint(_slaPolicy.metric);
            arr[1] = _slaPolicy.highGoal;
            arr[2] = _slaPolicy.middleGoal;
            arr[3] = _slaPolicy.refundMiddle;
            arr[4] = _slaPolicy.refundLow;
            return arr;
        }
    */
}