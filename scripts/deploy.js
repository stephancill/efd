const { network } = require("hardhat")
const web3 = require("web3")

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  )

  console.log("Account balance:", (await deployer.getBalance()).toString())

  const EFD = await ethers.getContractFactory("EthereumFriendDirectory")
  const efd = await EFD.deploy()
  await efd.deployed()
  console.log("Token address:", efd.address)
  saveDeployment(efd, "EthereumFriendDirectory")

  
  if (network.name === "localhost") {
    console.log("Deploying ENS")
    await deployENS()
  }
  
}

async function deployENS() {
  const [deployer] = await ethers.getSigners()

  const ENS = ethers.ContractFactory.fromSolidity(require('@ensdomains/ens/build/contracts/ENSRegistry.json'), deployer)
  const PublicResolver = ethers.ContractFactory.fromSolidity(require('@ensdomains/resolver/build/contracts/PublicResolver.json'), deployer)
  const ReverseRegistrar = ethers.ContractFactory.fromSolidity(require('@ensdomains/ens/build/contracts/ReverseRegistrar.json'), deployer)

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

  const connectedENS = ens.connect(deployer)
  const zeroBytes = ethers.utils.zeroPad(0, 32)
  await connectedENS.setSubnodeOwner(zeroBytes, web3.utils.sha3("eth"), deployer.address)
  await connectedENS.setSubnodeOwner(zeroBytes, web3.utils.sha3("reverse"), deployer.address)
  await connectedENS.setSubnodeOwner(namehash.hash("reverse"), web3.utils.sha3("addr"), reverseRegistrar.address)

  console.log("Deployed ENS", ens.address, publicResolver.address, reverseRegistrar.address)
}

function saveDeployment(contract, name) {
  const fs = require("fs")
  const path = require("path")
  const deploymentsDir = path.resolve(__dirname + "/../client/src/deployments/")
  const mapPath = path.resolve(deploymentsDir + "/map.json")
  const contractAddress = contract.address
  const chainId = contract.deployTransaction.chainId

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir)
  }

  var map = {networks: {}, chains: {}, contracts: {}}

  if (fs.existsSync(mapPath)) {
    map = JSON.parse(fs.readFileSync(mapPath).toString())
    console.log("Existing deployment map file found, updating...")
  } else {
    console.log("Creating new deployment map...")
  }

  if (!(chainId in map.contracts)) {
    map.contracts[chainId] = {}
    map.chains[network.name] = chainId
    map.networks[chainId] = network.name
  }

  if (name in map.contracts[chainId]) {
    map.contracts[chainId][name] = [contract.address, ...map.contracts[chainId][name]]
  } else {
    map.contracts[chainId][name] = [contractAddress]
  }

  fs.writeFileSync(
    mapPath,
    JSON.stringify(map, undefined, 2)
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
