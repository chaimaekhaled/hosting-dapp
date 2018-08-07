# Distributed application for server hosting providers
This application was developed during my master's thesis. It is a design science artifact to
solve problems in the domain of digital services, with a focus on service level agreements (SLA).

The design and development of this application is described in more detail in Dev_Info.pdf, which
use cases, sequence diagrams and architectural overviews.

## Requirements:

- make (gcc) (sudo apt-get install build-essential)
- MetaMask browser extension
- Windows: MS Visual C++ build tools
- python 2.7

## Installation:
- ubuntu only: sudo apt-get install build-essential
- windows only (as admin):  npm install --global --production windows-build-tools
- npm install
- sudo npm install -g truffle
- MetaMask mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

## Run the application (dev server):
In project root execute:
1. truffle develop (Windows: truffle.cmd develop)
2. npm run migrate (Windows: truffle.cmd migrate --reset --compile-all && npm run contracts)
3. node ./src/utils/SetMockData.js (optional, adds fake data, e.g., service offerings and contracts)
4. npm run start (starts dev webserver which server's react app)
5. Open http://localhost:3000 in browser
6. Use MetaMask in Browser to interact with truffle Blockchain

## Usage:
As a customer, you're able to buy services in the "Store" view of the web app.
The public key input is only for decoration with no functionality.
 
The billing view shows active service contracts, their achieved service performance and payment information.

Provider Contract:    0x345ca3e014aaf5dca488057592ee47305d9b3e10  
Provider Account: (0) 0x627306090abab3a6e1400e9345bc60c78a8bef57  
Customer Account: (1) 0xf17f52151ebef6c7334fad080c5704d77216b732

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
