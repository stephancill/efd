require("@nomiclabs/hardhat-waffle");
require("hardhat-dependency-compiler");
require("@nomiclabs/hardhat-etherscan");
require("@eth-optimism/hardhat-ovm")
require("@nomiclabs/hardhat-web3");


const { task } = require("hardhat/config");
const commonConfig = require("./common.hardhat.config")
const credentials = require("./credentials.json")

task("wallets", "Prints the list of accounts", async () => {
  const {wallets} = require("./tasks/wallets")
  wallets.forEach((w, i) => {
    console.log(`Address #${i}`)
    console.log(`Address: ${w.address}`)
    console.log(`Private key: ${w.privateKey}`)
    console.log("\n")
  })
})

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
  etherscan: {
    apiKey: credentials.ETHERSCAN_API_KEY
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${credentials.ALCHEMYAPI_SECRET}`,
      // accounts: [`${credentials.DEPLOYER_PRIVATE_KEY}`]
    },
    optimism: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      // This sets the gas price to 0 for all transactions on L2. We do this
      // because account balances are not automatically initiated with an ETH
      // balance (yet, sorry!).
      gasPrice: 0,
      ovm: true // This sets the network as using the ovm and ensure contract will be compiled against that.
    },
    ...commonConfig.networks
  },
  solidity: {
    compilers: [
      /* TODO: Waiting for https://github.com/ethereum-optimism/solidity/issues/23 
          to upgrade to 0.8.0 for SignatureChecker, which has support for contract 
          signatures.
      */
      // {
      //   version: "0.8.0"
      // },
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
  }
}