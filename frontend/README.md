# Sample Poll frontend

This directory has a minimal React-based frontend for the Poll smart contract.

## Running it

To run this frontend you have to follow this instructions:

1. Install [Metamask](https://metamask.io/) in your browser.
2. Start a testing network powered by Buidler EVM by running `npx buidler node` in the root of the repo.
3. Open your MetaMask and select the network "Localhost 8545".
4. Deploy the smart contract to your testing network with `npx buidler run scripts/deploy.js --network localhost`.
5. Run `npm run dev` in this directory.

## Interacting with the network and your contract

You are going to need some tesnting-network ETH in MetaMask to interact with your contract. To get some, copy your MetaMask address, and run `npx buidler send-eth <address> --network localhost` in the root of the repo.

You will also want to add proposals, open the poll and close it. You can do these things by running:

* `npx buidler add-proposal <description> --network localhost`
* `npx buidler open-poll --network localhost`
* `npx buidler close-poll --network localhost`