const { ethers, network } = require("hardhat")
const {registerENS} = require("./ens")
const casual = require('casual');
const { addFriend } = require("./efd");

async function randomGraph() {

  const accounts = await ethers.getSigners()

  // 1. Register ENS for all accounts
  let ensPromises = accounts.slice(0, Math.round(accounts.length/2)).map(async a => {
    const name = `${casual.first_name}${casual.last_name}`.toLowerCase()
    console.log(name, a.address)
    await registerENS(name, a.address, network)
  })
  await Promise.all(ensPromises)

  // 2. Adj
  let addFriendPromises = accounts.map(async a => {
    let subset = [...accounts.filter(_a => _a.address != a.address)]
    shuffle(subset)
    subset = subset.slice(0, 4)
    console.log(subset.map(s=>s.address))
    let subPromises = subset.map(async s => {
      await addFriend(a, s)
    })
    await Promise.all(subPromises)
  })

  await Promise.all(addFriendPromises)

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