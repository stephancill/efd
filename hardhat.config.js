require("@nomiclabs/hardhat-waffle");
require("hardhat-dependency-compiler");


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

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
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