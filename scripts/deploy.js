// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const EFD = await ethers.getContractFactory("EthereumFriendDirectory");
  const efd = await EFD.deploy();
  await efd.deployed();

  console.log("Token address:", efd.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(efd, "EthereumFriendDirectory");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../client/src/artifacts/deployments/";
  const mapFileName = "map.json"
  const contractAddress = contract.address
  const chainId = contract.deployTransaction.chainId

  console.log(contract.deployTransaction.chainId)

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  var map = {}
  try {
    // TODO: Fix update if existing
    map = JSON.parse(fs.readFileSync(contractsDir + mapFileName).toString())
    console.log("Existing deployment map file found, updating...")
  } catch (e) {
    console.error(e)
    console.log("Creating new deployment map...")
  }

  if (!(chainId in map)) {
    map[chainId] = {}
  }

  if (name in map[chainId]) {
    map[chainId][name] = [contract.address, ...map[chainId][name]]
  } else {
    map[chainId][name] = [contractAddress]
  }

  fs.writeFileSync(
    contractsDir + mapFileName,
    JSON.stringify(map, undefined, 2)
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
