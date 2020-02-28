import React from "react";
import ReactDOM from "react-dom";
import { ethers } from "ethers";

// You need to compile your contracts or this won't work
import PollArtifact from "../artifacts/Poll.json";

// You need to run `npx buidler run scripts/deploy.js` or this won't work
import contractAddress from "../contract-address.json";

// All the logic of this sample dapp is contained in the App component.
//
// It has these major parts:
//   - Polling for `windows.ethereum`'s selected address. 
//     `windows.ethereum` is a provider to the Ethereum network that wallets 
//     inject into the browser.
//     By default, this provider is locked, and users need to unlock it. This is
//     to keep the user's address private.
//     To unlock it, you need to call `window.ethereum.enable()`. 
//     To check if it has been unlocked, you can read 
//     `window.ethereum.selectedAddress`' value.
//     The user can lock it again whenever they want, so we poll if it's locked
//     using an interval.
//
//  - Initializing ethers and the Poll contract.
//    When we detect that the wallet has been unlocked, we initialize an 
//    instance of ethers using `window.ethereum` to create a new provider.
//    We store the instance of ethers in the App.
//    With that instance of ethers, we get the firts Signer, which will be 
//    associated to the wallet. If you send a transaction with it, the user
//    will have to confirm it in the wallet.
//    Then, we create an instance of Poll using that signer. Any transaction 
//    sent to the Poll will also go through the wallet.
//    We store this instance of the Poll in the App.
//
// - Afer initializing ethers we start another polling internal. This one gets
//   data about the user's account and the poll.
//   We get the account's balance, and every proposal's data.
//   We store this data in the App's state, so that a change will trigger a
//   re-render.
//   This data is used in normal presentational react components. These 
//   components know nothing about Ethereum.
//   Note that some numeric values are representend with Big Numebers, and they
//   can't be rendered directly. You can call their `toString()` method to do
//   that.
//   More info: https://docs.ethers.io/ethers.js/html/api-utils.html#big-numbers
//
// - Finally, we have a section that lets you vote for a proposal. This is 
//   implemented by passing a callback to a presentational component, and having
//   the actual voting logic in the App.
//   When sending a transaction you need to wait for it to get confirmed, so you
//   have to implement some kind of worflow for that.
//   In this example we just store which proposal we are voting for, and show
//   that while we are waiting for the tx to config.
//   Note that our error handling is not very robust. The transaction could fail
//   right away when you send it, throwing an exception, or later, when getting
//   mined.
//   You can improve how this is handling by polling for the transaction
//   receipt. A receipt is just a summary of the transaction, that isn't created
//   until the tx gets mined.
//   To get a receipt you can use `this._provider.getTransactionReceipt(txHash)`
//   More info: https://docs.ethers.io/ethers.js/html/api-providers.html#blockchain-status
//   and https://ethereum.stackexchange.com/a/16541


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      proposals: []
    };
  }

  componentDidMount() {
    this._selectedAddressInterval = setInterval(() => {
      if (
        window.ethereum === undefined ||
        window.ethereum.selectedAddress === this.state.selectedAddress
      ) {
        return;
      }

      this._intializeEthers();
      this._startPollingData();

      this.setState({
        selectedAddress: window.ethereum.selectedAddress
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._selectedAddressInterval);
    this._selectedAddressInterval = undefined;
    this._startPollingData();
  }

  render() {
    if (window.ethereum === undefined) {
      return NoWalletDetected();
    }

    if (!this.state.selectedAddress) {
      return UnlockWallet();
    }

    return (
      <div>
        <PollData proposals={this.state.proposals} />
        <Vote submitVote={this._submitVote.bind(this)} />
        <AccountData
          address={this.state.selectedAddress}
          balance={this.state.balance}
        />
      </div>
    );
  }

  _intializeEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    this._poll = new ethers.Contract(
      contractAddress.Poll,
      PollArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  _startPollingData() {
    // First we stop polling so that we don't do it multiple times at once.
    this._stopPollingData();

    this._pollDataInterval = setInterval(async () => {
      const proposals = [];
      try {
        const proposalsCount = await this._poll.getProposalsCount();

        for (let i = 0; i < proposalsCount; i++) {
          const proposal = await this._poll.proposals(i);

          proposals.push({
            id: i,
            description: proposal.description,
            votes: proposal.votes
          });
        }

        this.setState({
          balance: await this._provider.getBalance(this.state.selectedAddress)
        });
      } catch (error) {
        this._logMetamaskError("Error polling data", error);
        return;
      }

      this.setState({ proposals });
    }, 1000);
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  async _submitVote(id) {
    try {
      console.log("Voting for", id);
      const tx = await this._poll.vote(id);
      this.setState({ votingFor: id });

      await tx.wait();
      this.setState({ votingFor: undefined });
    } catch (error) {
      this._logMetamaskError("Error voting for " + id, error);
      console.error(error);
    }
  }

  _logMetamaskError(title, error) {
    if (error.data.message) {
      console.error(title + ":", error.data.message, error);
    } else {
      console.error(title, error);
    }
  }
}

function NoWalletDetected() {
  return <div>No Ethereum wallet was detected. Please install MetaMask.</div>;
}

function UnlockWallet() {
  return (
    <div>
      <div>Please unlock your wallet</div>
      <button type="button" onClick={() => window.ethereum.enable()}>
        Unlock
      </button>
    </div>
  );
}

function Container({ children }) {
  return (
    <div id="container">
      <h1>Decentralized Polls</h1>
      {children}
    </div>
  );
}

function PollData({ proposals }) {
  return (
    <div>
      <h2>Poll data</h2>
      {proposals.map(prop => (
        <div key={prop.id}>
          Proposal #{prop.id}: {prop.description} - {prop.votes.toString()}{" "}
          votes
        </div>
      ))}
    </div>
  );
}

function Vote({ submitVote, votingFor }) {
  if (votingFor) {
    return (
      <div>
        Voting for {votingFor}, please wait for your transaction to confirm
      </div>
    );
  }

  let ref;
  return (
    <div>
      <h2>Submit your vote</h2>
      Proposal:{" "}
      <input
        type="text"
        ref={r => {
          ref = r;
        }}
      />
      <button
        type="button"
        onClick={() => {
          submitVote(ref.value);
        }}
      >
        Vote
      </button>
    </div>
  );
}

function AccountData({ address, balance }) {
  return (
    <div>
      <h2>Your account</h2>
      <div>Address: {address || "loading..."}</div>
      <div>
        Balance: {balance !== undefined ? balance.toString() : "loading..."}
      </div>
    </div>
  );
}

ReactDOM.render(
  <Container>
    <App />
  </Container>,
  document.getElementById("root")
);
