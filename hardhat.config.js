require("@nomiclabs/hardhat-waffle");
require("hardhat-dependency-compiler");
const credentials = require("./credentials.json")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("ens", "Registers and ENS handle")
  .addParam("name", "The desired ENS domain")
  .addParam("address", "The resolution address")
  .setAction(async (args, hre, _) => {
    await require("./tasks/ens").registerENS(args.name, args.address, hre.network)
  });

task("befriend", "Befriends 2 addresses")
  .addParam("address1", "The desired ENS domain")
  .addParam("address2", "The resolution address")
  .setAction(async (params, hre) => {
    const accounts = await hre.ethers.getSigners()
    const account1 = accounts.find(a => a.address == params.address1)
    const account2 = accounts.find(a => a.address == params.address2)
    await require("./tasks/efd").addFriend(account1, account2)
  });

task("friends", "Get friends for address")
  .addParam("address", "The address to display friends of")
  .setAction(async (params, hre) => {
    const friends = await require("./tasks/efd").getFriends(params.address)
    console.log(friends)
  });

task("graph", "Reserves ENS names and creates a random EFS graph")
  .setAction(async () => {
    await require("./tasks/graph").randomGraph()
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${credentials.ALCHEMYAPI_SECRET}`,
      accounts: [`${credentials.DEPLOYER_PRIVATE_KEY}`]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: { } 
      },
      {
        version: "0.7.0"
      },
      {
        version: "0.7.4"
      },
    ]
  },
  paths: {
    artifacts: "./client/src/artifacts"
  },
  dependencyCompiler: {
    paths: [
      "@ensdomains/ens/contracts/ENSRegistry.sol",
      "@ensdomains/ens/contracts/ReverseRegistrar.sol",
      "@ensdomains/resolver/contracts/PublicResolver.sol",
      "@ensdomains/reverse-records/contracts/ReverseRecords.sol",
    ],
  }
}