const { expect } = require("chai");
require("@nomiclabs/hardhat-waffle");
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

async function deployContract() {
  const EFD = await ethers.getContractFactory("EthereumFriendDirectory");
  const efd = await EFD.deploy();
  await efd.deployed();
  return efd
}

describe("EFD", function() {
  it("Should deploy correctly", async function() {
    const accounts = await ethers.getSigners();
    const efd = await deployContract()
    const adj = await efd.getAdj(accounts[1].address)
    expect(adj[0].length).to.equal(0)
    expect(adj[1]).to.equal(0)
  });

  it("Should confirm accepted requests", async function() {
    const accounts = await ethers.getSigners();
    const efd = await deployContract()

    const senderSignature = await createRequest(accounts[0], accounts[1].address)
    const acceptSignature = await acceptRequest(accounts[0].address, accounts[1], senderSignature)

    await efd.connect(accounts[0]).confirmRequest(accounts[0].address, accounts[1].address, senderSignature, acceptSignature)

    // From account
    var [adj, length] = await efd.getAdj(accounts[0].address)
    expect(length).to.equal(adj.length)
    expect(length).to.equal(1)
    expect(adj[0]).to.equal(accounts[1].address)

    // To account
    var [adj, length] = await efd.getAdj(accounts[1].address)
    expect(length).to.equal(adj.length)
    expect(length).to.equal(1)
    expect(adj[0]).to.equal(accounts[0].address)
  });


});
