const ethereumjsABI = require("ethereumjs-abi")

async function createRequest(fromAccount, toAddress) {
  var hash = ethereumjsABI.soliditySHA3(
    ["address", "address"],
    [fromAccount.address, toAddress]
  );
  const signature = await fromAccount.signMessage(hash)
  return signature
}

async function acceptRequest(fromAddress, toAccount, requestSignature) {
  var hash = ethereumjsABI.soliditySHA3(
    ["address", "address", "bytes"],
    [fromAddress, toAccount.address, ethers.utils.arrayify(requestSignature)]
  );
  const signature = await toAccount.signMessage(hash)
  return signature
}

module.exports = {acceptRequest, createRequest}