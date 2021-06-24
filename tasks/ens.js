
const path = require("path")
const deploymentMap = require(path.resolve(__dirname, "../client/src/deployments/map.json"))
const web3 = require("web3")
const namehash = require("eth-ens-namehash")

async function registerENS(name, address, network) {

  let tld = "eth"
  let hashedname = namehash.hash(`${name}.eth`)

  let accounts = await ethers.getSigners()
  let owner = accounts[0]

  let ens = contractFromMap("ENS", require("@ensdomains/ens/build/contracts/ENSRegistry.json").abi, network).connect(owner)
  let resolver = contractFromMap("PublicResolver", require("@ensdomains/resolver/build/contracts/PublicResolver.json").abi, network).connect(owner)
  let reverseResolver = contractFromMap("ReverseRegistrar", require("@ensdomains/ens/build/contracts/ReverseRegistrar.json").abi, network).connect(owner)

  await ens.setSubnodeOwner(namehash.hash(tld), web3.utils.sha3(name), owner.address)
  await ens.setResolver(hashedname, resolver.address)
  await resolver["setAddr(bytes32,address)"](hashedname, address)
  
  let res1 = await resolver["addr(bytes32)"](hashedname)
  console.log(res1, "==", address)
  await reverseResolver.setName(`${name}.eth`)
  let res2 = await resolver.name(namehash.hash(`${address.slice(2)}.addr.reverse`))
  console.log(res2, "==", `${name}.eth`)
}

function contractFromMap(name, abi, network) {
  const chainId = deploymentMap.networks[network.name]
  const address = deploymentMap.contracts[chainId][name][0]
  const contract = new ethers.Contract(address, abi)
  return contract
}

module.exports = {
  registerENS
}
