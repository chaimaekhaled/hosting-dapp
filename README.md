# Distributed application for server hosting providers
This application was developed during my master's thesis. It is a design science artifact to
solve problems in the domain of digital services, with a focus on service level agreements (SLA).

The design and development of this application is described in more detail in Dev_Info.pdf, which
use cases, sequence diagrams and architectural overviews.

## Requirements:

- make (gcc) (sudo apt-get install build-essential)
- MetaMask browser extension

## Installation:
- sudo apt-get install build-essential
- npm install
- sudo npm install -g truffle

## Run the application (dev server):
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

## Disclaimer
