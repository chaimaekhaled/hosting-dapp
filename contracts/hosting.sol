pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2 ;

contract Hosting{
enum Metrics {Latency}

// ServiceOffer is a product of a provider (such as a Small V-Server)
struct ServiceOffer {
string name; //name will be used for the Products Mapping
uint id;
bool isActive; // flag to indicate lifecycle status of product
uint weeklyCost; // month has 30 days
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

struct ServiceDetails{
//uint _cpu, uint _ram, uint _traffic, uint _ssd
uint cpu; //count of vCPUs
uint ram; //in GB
uint traffic; //in TB
uint ssd; // in GB
}

function ServiceDetailsToVars(ServiceDetails _details) internal pure returns (uint, uint, uint, uint){
return (_details.cpu, _details.ram, _details.traffic, _details.ssd);
}


}