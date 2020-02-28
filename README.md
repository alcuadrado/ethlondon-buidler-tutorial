# ETH London Buidler Tutorial

This repository contains a sample project that you can use as a starting point for your ETH London project.

This project is intended to be used for the "Introduction to solidity and debugging" workshop, but you should be able to follow it by yourself by reading the README and exploring its `contracts/`, and `tests/` directories.

## Tools and libraries

This is the list of tools that we are going to use:

- [Buidler](https://buidler.dev/): An Ethereum developement task runner and testing network.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/ethers.js/html/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts): The de facto standard library of Solidity.

## Installation

To install this project all you need to do is cloning this repository and running `npm install`.

However, setting up your development environment for Ethereum can be tricky, so please read the next section.

### Development environment setup

Most Ethereum project require some special setup to be able to be installed.

To make sure your environment is ready, go to [this other repository](https://github.com/nomiclabs/ethereum-hackathon-setup-checker) and follow its instructions. It should only take a minute if your dev environment is ready.

## Visual Studio Code Setup

You can use any text editor or IDE to develop smart contract and dapps, but the most common one is [Visual Studio Code](https://code.visualstudio.com/). If you are in doubt about what to use, we recommend using it.

To add support for Solidity to Visual Studio Code, you need to install [Juan Blanco's Solidity extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity), and add these two entries to your settings:

```json
"solidity.packageDefaultDependenciesContractsDirectory": "",
"solidity.packageDefaultDependenciesDirectory": "node_modules",
```

## Project description

This project implements a simple polling smart contract. We won't focus on implementing the contract, so it is already available at `contracts/Poll.sol`.

Some important features it has:

- Each `Poll` contract represents a single poll.
- Each `Poll` has an owner account, which will be in charge of adding the different proposals, and openning and closing the poll when they want to.
- Everyone can vote on the poll as long as it is open.
- You can't change your vote.
- Each Ethereum account can vote once.

This smart contract has many problems. For instance, votes are completly public. Also, anyone can vote as many times as they want by using multiple accounts. We call this a [Sybil attack](https://en.wikipedia.org/wiki/Sybil_attack). We won't care about any of them in this tutorial.

## Writing and compiling smart contracts

To write a smart contract, all you need to do is to place it in a `*.sol` file. You don't need to match the file and contract name, but it is common practice and we recommend doing so.

While Solidity `0.6.x` has been recently released, our recommendation is to stick with [`0.5.15`](https://solidity.readthedocs.io/en/v0.5.15/) for this hackthon. Some tools and libraries haven't been fully migrated yet, and you don't want to spend your time debugging those.

To compile your contracts, all you need to do is running `npx buidler compile`.
Note that Buidler will automatically recompile them if needed when running your tests.

## Testing your smart contracts

Smart contracts are normally tested using JavaScript. You develop the contract in Solidity, but use an Ethereum library to have a JavaScript model of your contract and write your tests with it.

These JavaScript contract models are connected to an Ethereum node via the [Ethereum JSON-RPC interface](https://github.com/ethereum/wiki/wiki/JSON-RPC), run every function in that node, and return its result.

Buidler comes with its own testing network, and contract models are automatically connected to it when running your tests. This special network, called Buidler EVM, comes with extra functionality that make debugging your smart contracts easier.

### Mocha & Chai

Just like in most JavaScript projects, smart contract tests are written using Mocha and Chai. These are not Ethereum specific tools, but super popular JavaScript projects.

If you've never worked with Mocha and Chai, take a look at [`test/mocha-and-chai-introduction.js`](test/mocha-and-chai-introduction.js), which has a five minutes introduction to them.

To run your tests, all you need to do is `npx buidler test`.

## ethers.js

ethers.js is a complete Ethereum library that can be used in Node.js and the web. It lets you interact with Ethereum and your contracts with easy-to-use JavaScript models.

This section explains the main ethers' abstractions that we are going to work with.

### Ethereum Provider

A Provider abstracts a connection to the Ethereum blockchain. It lets you read the state of the blockchain and send transactions to the network.

When using Buidler, you can access an already-initialized provider with `ethers.provider`.

Some examples of things you can do with it include getting the balance of an address, or getting the latest block number.

You can try them in [the Buidler console](https://buidler.dev/guides/buidler-console.html) by running `npx buidler console` and pasting these examples:

```js
console.log(`Address 0xc783df8a850f42e7F7e57013759C285caa701eB6 has ${await ethers.provider.getBalance("0xc783df8a850f42e7F7e57013759C285caa701eB6")} wei`);

console.log("The latest block number is", await ethers.provider.getBlockNumber());
```

To learn more about `Provider`s, you can look at [their documentation](https://docs.ethers.io/ethers.js/html/api-providers.html).

### Signers

A `Signer` in ethers is an object that represents an Ethereum account. It is used to send transactions to contracts and other accounts, and to read its state in the network.

When using Buidler, you can access the signers that represent the accounts of the node you are connected to by using `await ethers.getSigners()`.

Some examples of things you can do with a `Signer` include getting its address, its balance, and sending transactions.

You can try them in the Buidler console with:

```js
const [signer, ...otherSigners] = await ethers.getSigners();
console.log("The signer's address is", await signer.getAddress());
console.log("The signer's balance is", (await signer.getBalance()).toString());
```

To learn more about `Signers`s, you can look at the [Wallet and Signers documentation](https://docs.ethers.io/ethers.js/html/api-wallet.html). Note that a `Wallet` is just a `Signer` that manages its own private key.

### ContractFactory's

A contract factory is an abstraction used to deploy new smart contracts. You can get one in Buidler using `await ethers.getContractFactory("ContractName")`.

Let's deploy a `Poll` using a contract factory from the Buidler console:

```js
const Poll = await ethers.getContractFactory("Poll");
const poll = await Poll.deploy("The poll name"); // We send the deployment tx
await poll.deployed(); // We wait for the tx to get mined

console.log("Deployed a new Poll to", poll.address);
```

To learn more about `ContractFactory`s, you can look at [their documentation](https://docs.ethers.io/ethers.js/html/api-contract.html#deploying-a-contract).


### Contracts

When you deploy a contract using a `ContractFactory` you get a `Contract` instance. This is an object that has a JavaScript function for each of your smart contract's functions.

Contracts functions be constant (i.e. `pure` or `view`) or non-constant. These are treated differently from outside of Solidity.

Calling a constant function doesn't modify the Ethereum state, so no transaction needs to be sent, and there's no associated gas cost to calling it.

Calling a non-constant function, normally modifies the Ethereum state, so you have to call them with a transaction.

ethers.js automatically knows what to do, but you should keep the distintion in mind, as constant functions will return a value, and non-constants won't. Also,
normally have to wait from your transaction to get mined.

Let's call some of them from the Buidler console:

```js
const Poll = await ethers.getContractFactory("Poll");
const poll = await Poll.deploy("The poll name");
await poll.deployed();

console.log("Number of proposals", (await poll.getProposalsCount()).toString());

const tx = await poll.addProposal("Proposal 1");
console.log("Adding a new proposal with tx", tx.hash);

// Wait for the tx to be mined
await tx.wait();
console.log("Transaction confirmed");
```

### Calling contract functions from other accounts

When using Buidler, all your `ContractFactory`s and `Contracts` are associated by default to your first account. This means that transactions to deploy and call functions will be sent from it.

To use other accounts, you have to call the `connect(signer)` method of your factories and contracts. It will return a new factory/contract, associated to another account.

For example, to deploy a `Poll` from your second account, pase this in the Buidler console:

```js
const signers = await ethers.getSigners();
const Poll = await ethers.getContractFactory("Poll");
const PollConnectedToSigner1 = Poll.connect(signers[1]);

const poll = await PollConnectedToSigner1.deploy("The poll name");
await poll.deployed();
```

## Waffle's Chai matchers

Chai comes with a lot of assertion functions, called matchers, built-in. This are incredibly useful when testing JavaScript applications, but are not enough for testing smart contracts.

We want to be able to check if a transaction failed, which was its revert message, the events it emitted, etc.

To make all these things in an easy and intuitive way, we can use [Waffle's Cahi matchers](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html). These are extra assertion functions that get added to Chai.

For example, you can check if a transaction failed by doing:

```js
await expect(poll.vote(0)).to.be.reverted;
```

Waffle comes with matchers for:

* Big Numbers
* Events
* Reverts and revert reasons
* Balance changes
* Addresses validation

You don't need to do anything to install these matchers, they are already installed in this project.

## Debugging your smart contracts with Buidler EVM

Buidler EVM is a development network built to make developing and testing smart contracts easier.

It makes debugging easier by adding stack traces and `console.log` to Solidity.

To learn more about Buidler EVM, take a look at [its documentation](https://buidler.dev/buidler-evm/).

### Solidity stack traces

Buidler EVM knows which contracts are being executed. When a transaction fails, it knows exactly why that happened.

It uses this info to create Solidity stack traces when a transaction is rejected. These are encoded as normal JavaScript stack traces, so you don't need to do anything special for them to work.

For example, if we try to vote in a Poll that hasn't openned yet, we'll see an exception like this. Which has the revert reason and the line where the Solidity stack trace.

```
Error: VM Exception while processing transaction: revert The poll is not open
  at Poll.vote (contracts/Poll.sol:57)
  at process._tickCallback (internal/process/next_tick.js:68:7)
```

### Using `console.log` from Solidity

When running your contracts on Buidler EVM, you can use `console.log` from Solidity. This is very helpful to understand the state of your contract, and why your transactions are failing.

To do so, you need to import the console library with:

```solidity
import "@nomiclabs/buidler/console.sol";
```

Then, you can use it like JavaScript `console.log`:

```solidity
function vote(uint256 _proposalId) public {
    console.log("Accounts %s is voting for %s", msg.sender, _proposalId);

    require(isOpen, "The poll is not open");
    proposals[_proposalId].votes += 1;

    require(!hasVoted[msg.sender], "You have already voted");
    hasVoted[msg.sender] = true;

    emit VoteCasted(_proposalId, msg.sender, proposals[_proposalId].votes);
}
```

### Verbose Buidler EVM output

If you want to know which RPC calls are being made, you can enable Buidler EVM's verbose output.

To do so, open `buidler.config.js` and add `loggingEnabled: true` to `module.exports.networks.buidlerevm`.

## Deploying a smart contract

To deploy a smart contract you just need to get an ethers `ContractFactory` and use its deployment functionality we already saw.

We already created a script that deploys the `Poll`, which you can run with
`npx buidler run scripts/deploy.js --network <network-name>`.

The `--network` parameters indicates which network we want to deploy to. If none is provided, Buidler will start a new instance of Buidler EVM, deploy your contracts into it, and then destroy it, which wouldn't be useful.

This project has multiple networks already setup:

* `localhost`: A local testing network. Start one with `npx buidler node`. You need to restart it after recompiling your contracts.
* `mainnet`: The main Ethereum network.
* Testnets:
  * `ropsten`
  * `kovan`
  * `rinkeby`
  * `gorli`

Rember that you need to have ETH in the account that you are going to use to deploy your contracts. You can get some for testnets from faucet, a service that distributes testing-ETH for free.

* [Ropsten faucet](https://faucet.metamask.io/)
* [Kovan faucet](https://faucet.kovan.network/)
* [Rinkeby faucet](https://faucet.rinkeby.io/)
* [Gorli faucet](https://goerli-faucet.slock.it/)

## Writing a frontend

You can find an example of a minimal frontend for this contract in [frontend/](frontend/)

## Useful links

- [Buidler's documentation](https://buidler.dev/getting-started/)
  - [Buidler's Config docs](https://buidler.dev/config/)
- [Mocha's documentation](https://mochajs.org/#hooks)
- [Chai's `expect` API](https://www.chaijs.com/api/bdd/)
- [Waffle's Matchers](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)
- [Ethers' documentation](https://docs.ethers.io/ethers.js/html/)
  - [Provider](https://docs.ethers.io/ethers.js/html/api-providers.html)
  - [Signer](https://docs.ethers.io/ethers.js/html/api-wallet.html)
  - [Contract](https://docs.ethers.io/ethers.js/html/api-contract.html)
  - [Utils](https://docs.ethers.io/ethers.js/html/api-utils.html)
  - [Useful constants](https://docs.ethers.io/ethers.js/html/api-utils.html#constants)
- [OpenZeppelin Contracts documentation](https://docs.openzeppelin.com/contracts/2.x/)
