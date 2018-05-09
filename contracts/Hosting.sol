pragma solidity ^0.4.19;

contract Hosting {
    enum Metrics {Latency}

    // ServiceOffer is a product of a provider (such as a Small V-Server)
    struct ServiceOffer {
        string name; //name will be used for the Products Mapping
        int id;
        ServiceDetails specs;
        SLAPolicy sla;
    }

    // SLAPolicy contains metrics with goals and refundpolicy
    struct SLAPolicy {
        Metrics metric;
        int highGoal;
        int middleGoal;
        int refundMiddle;
        int refundLow;
    }

    struct ServiceDetails {
        uint8 cpu; //count of vCPUs
        uint8 ram; //in GB
        uint8 traffic; //in TB
        uint16 ssd; // in GB
    }


}