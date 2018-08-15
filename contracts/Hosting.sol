pragma solidity ^0.4.21;

/*
    This file contains the hosting library that offers data models as structs.
*/
library Hosting {


    // ServiceOffer is a product of a provider (such as a Small V-Server)
    struct ServiceOffer {
        string name; //name will be used for the Products Mapping
        uint id;
        uint costPerDay; // month has 30 days
        uint[] specs;
        uint[] sla;
    }

    // SLAPolicy contains metrics with goals and refundpolicy
    struct SLAPolicy {
        uint metric; //since only availability is implemented, this is usually set to 0;
        uint highGoal; // The Service smart contract will check for greater or equal ( >= )
        uint middleGoal; // The Service smart contract will check for greater or equal ( >= )
        uint refundMiddle;
        uint refundLow;
    }

    struct ServiceDetails {
        uint cpu; //count of vCPUs
        uint ram; //in GB
        uint traffic; //in TB
        uint ssd; // in GB
    }
}