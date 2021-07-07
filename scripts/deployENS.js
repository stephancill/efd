const { ethers } = require("hardhat")
const web3 = require("web3")
const { saveDeployment } = require("./common")

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  )

  console.log("Account balance:", (await deployer.getBalance()).toString())
  await deployENS()
}

// https://medium.com/the-ethereum-name-service/adding-ens-into-your-dapp-72eb6deac26b
// TODO: Refactor this for deployment on live network
async function deployENS() {
  const [deployer] = await ethers.getSigners()

  const ENS = await ethers.getContractFactory("ENSRegistry", deployer)
  const PublicResolver = await ethers.getContractFactory("PublicResolver", deployer)
  const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar", deployer)
  const ReverseRecords = await ethers.getContractFactory("ReverseRecords", deployer)

  const namehash = require('eth-ens-namehash')

  const ens = await ENS.deploy()
  await ens.deployed()
  saveDeployment(ens, "ENS")

  const publicResolver = await PublicResolver.deploy(ens.address)
  await publicResolver.deployed()
  saveDeployment(publicResolver, "PublicResolver")

  const reverseRegistrar = await ReverseRegistrar.deploy(ens.address, publicResolver.address)
  await reverseRegistrar.deployed()
  saveDeployment(reverseRegistrar, "ReverseRegistrar")

  const reverseRecords = await ReverseRecords.deploy(ens.address)
  await reverseRecords.deployed()
  saveDeployment(reverseRecords, "ReverseRecords")

  const connectedENS = ens.connect(deployer)
  const zeroBytes = ethers.utils.zeroPad(0, 32)
  await connectedENS.setSubnodeOwner(zeroBytes, web3.utils.sha3("eth"), deployer.address)
  await connectedENS.setSubnodeOwner(zeroBytes, web3.utils.sha3("reverse"), deployer.address)
  await connectedENS.setSubnodeOwner(namehash.hash("reverse"), web3.utils.sha3("addr"), reverseRegistrar.address)

  console.log("Deployed ENS", ens.address, publicResolver.address, reverseRegistrar.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
