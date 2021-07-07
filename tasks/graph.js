const { ethers, network, web3, Web3 } = require("hardhat")
const {registerENS} = require("./ens")
const casual = require('casual');
const { addFriend, getFriends } = require("./efd");
const { OptimismProvider } = require("@eth-optimism/provider") // TODO: Use optimismprovider

async function synchronouslyExecute(promiseFunctions) {
  for (const p of promiseFunctions) {
    await p()
  }
}

async function randomGraph() {

  const accounts = await ethers.provider.listAccounts();

  const web3Provider = new ethers.providers.Web3Provider(web3.currentProvider)
  const l1Provider = new ethers.providers.Web3Provider(web3.currentProvider)
  const l2Provider = new OptimismProvider("http://localhost:8545", web3Provider) // This needs to point to http://localhost:8545

  await Promise.all([l1Provider.getNetwork(), l2Provider.getNetwork()])

  const l1Accounts = await Promise.all(accounts.map(a => l1Provider.getSigner(a)))
  const l2Accounts = await Promise.all(accounts.map(a => l2Provider.getSigner(a)))

  // 1. Register ENS for all accounts
  let ensPromises = l1Accounts.slice(0, Math.round(l1Accounts.length/2)).map((a) => async () => {
    const name = `${casual.first_name}${casual.last_name}`.toLowerCase()
    const address = a.address
    console.log(name, address)
    await registerENS(name, address, network)
  })

  await synchronouslyExecute(ensPromises)

  // 2. Adj
  const accountsAndAddresses = await Promise.all(l2Accounts.map(async account => {
    const address = await account.getAddress()
    console.log(address)
    return {
      address,
      account
    }
  }))
  let addFriendPromises = accountsAndAddresses.map(aa => async () => {
    let subset = [...accountsAndAddresses.filter(_a => _a.address != aa.address)]
    shuffle(subset)
    subset = subset.slice(0, 4)
    let subPromises = subset.map(s => async () => {
      await addFriend(aa.account, s.account)
    })
    await synchronouslyExecute(subPromises)
  })

  await synchronouslyExecute(addFriendPromises)

}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * https://stackoverflow.com/a/6274381/11363384
 */
 function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = {
  randomGraph
}