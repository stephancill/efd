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

  var map = {}

  if (fs.existsSync(mapPath)) {
    map = JSON.parse(fs.readFileSync(mapPath).toString())
    console.log("Existing deployment map file found, updating...")
  } else {
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
