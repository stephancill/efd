const { expect } = require("chai");
require("@nomiclabs/hardhat-waffle");
const {createRequest, acceptRequest} = require("../client/src/util")


async function deployContract() {
  const EFD = await ethers.getContractFactory("EthereumFriendDirectory");
  // const efd = await EFD.deploy();
  // await efd.deployed();
  const efd = await EFD.attach("0xc6e7DF5E7b4f2A278906862b61205850344D4e7d")
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

    let senderSignature = await createRequest(accounts[0], accounts[1].address, efd)
    let acceptSignature = await acceptRequest(accounts[0].address, accounts[1], senderSignature, efd)

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


    // Exceptions
    senderSignature = await createRequest(accounts[0], accounts[0].address, efd)
    acceptSignature = await acceptRequest(accounts[0].address, accounts[0], senderSignature, efd)
    const tx = efd.connect(accounts[0]).confirmRequest(accounts[0].address, accounts[0].address, senderSignature, acceptSignature)
    await expect(tx).to.be.revertedWith("Addresses cannot be the same")
  });

  it("Should remove addresses from adj", async function() {
    const accounts = await ethers.getSigners();
    const efd = await deployContract()

    let senderSignature = await createRequest(accounts[0], accounts[1].address, efd)
    let acceptSignature = await acceptRequest(accounts[0].address, accounts[1], senderSignature, efd)

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


    await efd.connect(accounts[0]).removeAdj(accounts[1].address)

    // From account
    var [adj, length] = await efd.getAdj(accounts[0].address)
    expect(length).to.equal(0)

    // To account
    var [adj, length] = await efd.getAdj(accounts[1].address)
    expect(length).to.equal(0)
  });

});
