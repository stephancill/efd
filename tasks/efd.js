const { ethers, network } = require("hardhat")
const {createRequest, acceptRequest} = require("../client/src/util")
const path = require("path")
const deploymentMap = require(path.resolve(__dirname, "../client/src/deployments/map.json"))

async function getEFD(chainId) {
  chainId = chainId || deploymentMap.chains[network.name]
  const address = deploymentMap.contracts[chainId]["EthereumFriendDirectory"][0]
  const artifact = await ethers.getContractFactory("EthereumFriendDirectory")
  const efd = artifact.attach(address)
  return efd
}

async function getFriends(address, user) {
  const chainId = user ? await user.getChainId() : undefined
  const efd = await getEFD(chainId)
  user = user || await ethers.getSigner(address)

  const [adj] = await efd.connect(user).getAdj(address)

  return adj
}

async function addFriend(account1, account2) {
  const chainId = await account1.getChainId()
  let efd = await getEFD(chainId)
  efd = efd.connect(account1)

  const account1Address = await account1.getAddress()
  const account2Address = await account2.getAddress()

  const senderSignature = await createRequest(account1, account2Address, efd)
  const acceptSignature = await acceptRequest(account1Address, account2, senderSignature, efd)

  const tx = await efd.connect(account1).confirmRequest(account1Address, account2Address, senderSignature, acceptSignature)
  await tx.wait()
}


module.exports = {
  addFriend,
  getFriends
}