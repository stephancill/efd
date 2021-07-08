
const path = require("path")
const deploymentMap = require(path.resolve(__dirname, "../client/src/deployments/map.json"))
const web3 = require("web3")
const namehash = require("eth-ens-namehash")
const { ethers } = require("hardhat")

async function registerENS(name, address, network) {

  console.log("Registering", name, address)

  let tld = "eth"
  let hashedname = namehash.hash(`${name}.eth`)

  let accounts = await ethers.getSigners()

  let owner = accounts[0]

  let potentialUsers = accounts.filter(a => a.address.toLowerCase() == address.toLowerCase())
  let user = accounts[0]
  if (potentialUsers.length > 0) {
    user = potentialUsers[0]
  } else {
    console.error("Account not found")
  }

  // New names have to be registered by owner of tld
  let ens = await contractFromMap("ENS", "ENSRegistry", network, owner) 
  let resolver = await contractFromMap("PublicResolver", "PublicResolver", network, owner)
  // Reverse record can be set by the record owner
  let reverseResolver = await contractFromMap("ReverseRegistrar", "ReverseRegistrar", network, user)

  tx = await ens.setSubnodeOwner(namehash.hash(tld), web3.utils.sha3(name), owner.address)
  await tx.wait()
  
  tx = await ens.setResolver(hashedname, resolver.address)
  await tx.wait()
  
  tx = await resolver["setAddr(bytes32,address)"](hashedname, address)
  await tx.wait()
  
  let res1 = await resolver["addr(bytes32)"](hashedname)
  console.log(res1, "==", address)
  tx = await reverseResolver.setName(`${name}.eth`)
  await tx.wait()
  let res2 = await resolver.name(namehash.hash(`${address.slice(2)}.addr.reverse`))
  console.log(res2, "==", `${name}.eth`)
}

async function contractFromMap(name, artifactName, network, user) {
  const chainId = network.chainId
  const address = deploymentMap.contracts[chainId][name][0]
  
  const artifact = await ethers.getContractFactory(artifactName, user)

  const contract = artifact.attach(address)
  return contract
}

module.exports = {
  registerENS
}
