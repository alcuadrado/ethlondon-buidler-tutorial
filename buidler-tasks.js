// This is a Buidler task that lets you send 1 ETH from your first account to
// a receiver provider to Buidler's CLI.
//
// Run `npx buidler send-eth <receiver>` to use it.
task("send-eth", "Sends 1 ETH from your first account to the receiver")
  .addPositionalParam("receiver", "The account that will receive the ETH")
  .setAction(async ({ receiver }) => {
    if (network.name === "buidlerevm") {
      throw new Error(
        `You are trying to send ETH to an account in the Buidler EVM network, which gets automatically created and destroyed every time.
        
Use the --network Buidler option`
      );
    }

    const [firstAccount] = await ethers.getSigners();
    const tx = await firstAccount.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther
    });

    console.log(`1 ETH sent to ${receiver} in the transaction ${tx.hash}`);
  });

// This is a Buidler task to add a proposal to the Poll deployed with
// scripts/deploy.js.
//
// Run `npx buidler add-proposal <description>` to use it.
task("add-proposal", "Adds a proposal")
  .addPositionalParam("description", "The proposal's description")
  .setAction(async ({ description }) => {
    if (network.name === "buidlerevm") {
      throw new Error(
        `You are trying to add a proposal to a contract in the Buidler EVM network, which gets automatically created and destroyed every time.
        
Use the --network Buidler option`
      );
    }

    const contractAddress = require("./contract-address.json");
    const poll = await ethers.getContractAt("Poll", contractAddress.Poll);

    await poll.addProposal(description);

    console.log("Proposal submitted");
  });

// This is a Buidler task to open the Poll deployed with scripts/deploy.js.
//
// Run `npx buidler open-poll` to use it.
task("open-poll", "Opens the poll").setAction(async () => {
  if (network.name === "buidlerevm") {
    throw new Error(
      `You are trying to open a poll in the Buidler EVM network, which gets automatically created and destroyed every time.
        
Use the --network Buidler option`
    );
  }

  const contractAddress = require("./contract-address.json");
  const poll = await ethers.getContractAt("Poll", contractAddress.Poll);

  await poll.open();

  console.log("Poll openned");
});

// This is a Buidler task to close the Poll deployed with scripts/deploy.js.
//
// Run `npx buidler close-poll` to use it.
task("close-poll", "Closes the poll").setAction(async () => {
  if (network.name === "buidlerevm") {
    throw new Error(
      `You are trying to close a poll in the Buidler EVM network, which gets automatically created and destroyed every time.
        
Use the --network Buidler option`
    );
  }

  const contractAddress = require("./contract-address.json");
  const poll = await ethers.getContractAt("Poll", contractAddress.Poll);

  await poll.close();

  console.log("Poll closed");
});
