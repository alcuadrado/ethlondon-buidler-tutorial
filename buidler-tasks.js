// This is a Buidler task that lets you send 1 ETH from your first account to
// a receiver provider to Buidler's CLI.
//
// Run `npx buidler send-eth <receiver>` to use it.
task("send-eth", "Sends 1 ETH from your first account to the receiver")
  .addPositionalParam("receiver", "The account that will receive the ETH")
  .setAction(async ({ receiver }, { ethers }) => {
    const [firstAccount] = await ethers.getSigners();
    const tx = await firstAccount.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther
    });

    console.log(`1 ETH sent to ${receiver} in the transaction ${tx.hash}`);
  });