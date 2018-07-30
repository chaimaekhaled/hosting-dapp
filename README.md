## Requirements:

- make (gcc) (sudo apt-get install build-essential)
- MetaMask browser extension

## Installation:
- sudo apt-get install build-essential
- npm install
- sudo npm install -g truffle

## Running:
In project root execute:
1. truffle develop
2. npm run migrate
3. node ./src/utils/SetMockData.js (optional, adds fake data)
4. npm run start (starts dev webserver which server's react app)
5. Open http://localhost:3000 in browser

## Usage:
As a customer, you're able to buy services in the "Store" view of the web app.
The public key input is only for decoration with no functionality.
 
The billing view shows active service contracts, their achieved service performance and payment information.


## Project structure:
├-  contracts                   # Smart Contract files (.sol)  
├-  migrations                  # necessary for truffle  
├-  public                      # static content of website  
├-  src                         #  
>   ├- components               # React components that are used in views  
>   ├- contracts                # copy of ./contracts (for import in web app)  
>   ├- css                      # style sheets  
>   ├- heartbeatOracle          # Node.js-based Oracle to send heartbeats to Blockchain  
>   ├- layout                   # contains views for react web app   
>   └- utils                    # contains utilities for support (e.g., web3js, test data) 

├-  test                        # contains tests for distributed application  
├-  README.md                   # this file  
├-  package-lock.json           # required for npm  
├-  package.json                # required for npm  
├-  truffle-config.js           # Truffle configuration file for Windows  
└-  truffle.js                  # Truffle configuration file
