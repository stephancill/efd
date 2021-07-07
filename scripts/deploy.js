const { network, ethers } = require("hardhat")
const { saveDeployment } = require("./common")

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  )

  console.log("Account balance:", (await deployer.getBalance()).toString())

  const EFD = await ethers.getContractFactory("EthereumFriendDirectory")
  const efd = await EFD.deploy({gasPrice: 0})
  await efd.deployed()
  console.log("Token address:", efd.address)
  saveDeployment(efd, "EthereumFriendDirectory")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
