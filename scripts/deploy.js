const fs = require("fs");

async function main() {
  if (network.name === "buidlerevm") {
    throw new Error(
      `You are trying to deploy a contract to the Buidler EVM network, which gets automatically created and destroyed every time.
        
Use the Buidler option '--network localhost'`
    );
  }

  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Poll = await ethers.getContractFactory("Poll");
  const poll = await Poll.deploy("My Poll");

  console.log("Poll address:", poll.address);

  // We save the address to access it from the frontend
  fs.writeFileSync(
    __dirname + "/../contract-address.json",
    JSON.stringify({ Poll: poll.address }, undefined, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
