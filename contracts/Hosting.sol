pragma solidity ^0.4.19;
//pragma experimental ABIEncoderV2;

contract Hosting{
    enum Metrics {Latency}

    // ServiceOffer is a product of a provider (such as a Small V-Server)
    struct ServiceOffer {
        string name; //name will be used for the Products Mapping
        uint id;
        bool isActive; // flag to indicate lifecycle status of product
        uint costPerDay; // month has 30 days
        ServiceDetails specs;
        SLAPolicy sla;
    }

    // SLAPolicy contains metrics with goals and refundpolicy
    struct SLAPolicy {
        Metrics metric;
        uint highGoal;
        uint middleGoal;
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

    function ServiceDetailsToVars(ServiceDetails _details) internal pure returns (uint, uint, uint, uint){
        return (_details.cpu, _details.ram, _details.traffic, _details.ssd);
    }

    function ServiceDetailsToArray(ServiceDetails _details) internal pure returns (uint[]){
        uint[] memory arr = new uint[](4);
        arr[0] = _details.cpu;
        arr[1] = _details.ram;
        arr[2] = _details.traffic;
        arr[3] = _details.ssd;
        return arr;
    }

    function SLAPolicyToVars(SLAPolicy _slaPolicy) internal pure returns (Metrics, uint, uint, uint, uint){
        return (_slaPolicy.metric, _slaPolicy.highGoal, _slaPolicy.middleGoal, _slaPolicy.refundMiddle, _slaPolicy.refundLow);
    }

    function SLAPolicyToArray(SLAPolicy _slaPolicy) internal pure returns (uint[]){
        uint[] memory arr = new uint[](5);
        arr[0] = uint(_slaPolicy.metric);
        arr[1] = _slaPolicy.highGoal;
        arr[2] = _slaPolicy.middleGoal;
        arr[3] = _slaPolicy.refundMiddle;
        arr[4] = _slaPolicy.refundLow;
        return arr;
    }

}