const ethers = require("ethers")

async function createRequest(fromAccount, toAddress, efd) {
  const fromAddress = await fromAccount.getAddress()
  var hash = await efd.hashRequest(fromAddress, toAddress)
  const signature = await fromAccount.signMessage(ethers.utils.arrayify(hash))
  return signature
}

async function acceptRequest(fromAddress, toAccount, requestSignature, efd) {
  const toAddress = await toAccount.getAddress()
  var hash = await efd.hashAccept(fromAddress, toAddress, ethers.utils.arrayify(requestSignature))
  const signature = await toAccount.signMessage(ethers.utils.arrayify(hash))
  return signature
}

module.exports = {acceptRequest, createRequest}