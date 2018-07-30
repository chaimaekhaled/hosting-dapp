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