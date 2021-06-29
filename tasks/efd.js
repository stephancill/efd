const { ethers, network } = require("hardhat")
const {createRequest, acceptRequest} = require("../client/src/util")
const path = require("path")
const deploymentMap = require(path.resolve(__dirname, "../client/src/deployments/map.json"))

async function getEFD() {
  const chainId = deploymentMap.chains[network.name]
  const address = deploymentMap.contracts[chainId]["EthereumFriendDirectory"][0]
  const artifact = await ethers.getContractFactory("EthereumFriendDirectory")
  const efd = artifact.attach(address)
  return efd
}

async function getFriends(address) {
  const efd = await getEFD()
  const user = await ethers.getSigner(address)

  const [adj, _] = await efd.connect(user).getAdj(address)
  
  return adj
}

async function addFriend(account1, account2) {
  const efd = await getEFD()

  const senderSignature = await createRequest(account1, account2.address, efd)
  const acceptSignature = await acceptRequest(account1.address, account2, senderSignature, efd)

  await efd.connect(account1).confirmRequest(account1.address, account2.address, senderSignature, acceptSignature)
}





module.exports = {
  addFriend,
  getFriends
}