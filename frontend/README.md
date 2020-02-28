# Sample Poll frontend

This directory has a minimal React-based frontend for the Poll smart contract.

You can find all of the code, and its explanation, in [index.js](./index.js).

## Running it

To run this frontend you have to follow this instructions:

1. Run `npm install` in this project.
2. Install [Metamask](https://metamask.io/) in your browser.
3. Start a testing network powered by Buidler EVM by running `npx buidler node` in the root of the repo.
4. Open your MetaMask and select the network "Localhost 8545".
5. Deploy the smart contract to your testing network with `npx buidler run scripts/deploy.js --network localhost` in the root of the repo.
6. Run `npm run dev` in this directory.
7. Go to [http://localhost:1234](http://localhost:1234)

## Interacting with the network and your contract

You are going to need some testing-network ETH in MetaMask to interact with your contract. To get some, copy your MetaMask address, and run `npx buidler send-eth <address> --network localhost` in the root of the repo.

You will also want to add proposals, open the poll and close it. You can do these things by running:

* `npx buidler add-proposal <description> --network localhost`
* `npx buidler open-poll --network localhost`
* `npx buidler close-poll --network localhost`

## Recompiling your contracts and Buidler EVM

If you change your contracts, you'll need to recompile them, reset Buidler EVM,
and redeploy them.

## Resetting MetaMask's accounts

Every time you restart Buidler EVM, you need to reset MetaMask's accounts.

To do it, you need to open MetaMask, click in the accounts selection circle, go to `Settings > Advanced`, click `Reset Accounts` and confirm.