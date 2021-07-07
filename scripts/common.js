const { network } = require("hardhat")

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

module.exports = {saveDeployment}