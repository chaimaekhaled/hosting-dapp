pragma solidity ^0.4.0;

contract Provider {
    enum Metrics {Latency}


    address owner; // Provider's eth address
    string public name;
    mapping(address => address[]) customerDB;
    string[] public products; // Overview of available Products (== available keys of Products mapping)
    mapping(string => ServiceOffer) Products;
    ServiceOffer[] public services;

    // ServiceOffer is a product of a provider (such as a Small V-Server)
    struct ServiceOffer {
        string name; //name will be used for the Products Mapping
        int id;
        // ServiceDetails could be an own struct
        string details;
    }

    // SLAPolicy contains metrics with goals and refundpolicy
    struct SLAPolicy {
        SLAMetric metric;
    }

    // SLAMetric is a performance indicator with goals and refund percentages
    struct SLAMetric {
        Metrics metric;
        int highGoal;
        int middleGoal;
        int refundMiddle;
        int refundLow;
    }

    function Provider(){

    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    function buyService(ServiceOffer _service) public payable returns (address) {
        if (_service.product == Products.StandardServer) {
            // create a new StandardServer smart contract
            // pay ETH into this new contract
            // add new contract to customerDB
            // return contract's address
        } else {
            // return gas
        }
    }

    function addProduct(ServiceOffer _product) public {//add modifier for access restriction to owner
        // Add product to available offers
        products.push(_product.name);
        Products[product.name] = _product;
    }

    function removeProduct(string _product) public {//add modifier for access restriction to owner
        for (int i = 0; i < products.length; i++) {
            if (products[i] == _product) {
                delete products[i];
                break;
            }
        }
    }
}
