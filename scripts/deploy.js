require("@nomiclabs/hardhat-waffle");

async function main() {
  // We get the contract to deploy
  const accounts = await ethers.getSigners();
  
  const EFD = await ethers.getContractFactory("EthereumFriendDirectory");
  const efd = await EFD.deploy(100, accounts[0].address);
  console.log(accounts[0].privateKey)
  
  await efd.deployed();

  console.log("EFD deployed to:", efd.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
