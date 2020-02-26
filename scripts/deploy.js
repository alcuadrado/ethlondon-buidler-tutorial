async function main() {
  const Poll = await ethers.getContractFactory("Poll");
  const poll = await Poll.deploy("My Poll");

  console.log("Poll address:", poll.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
