/*
    Produces the default hardhat signers
*/
const { ethers } = require("hardhat");

function getWallets() {

    const hdPathBase = "m/44'/60'/0'/0"
    const mnemonic = "test test test test test test test test test test test junk"

    const hdPaths = []
    for (let i = 0; i < 20; i++) {
        hdPaths.push(`${hdPathBase}/${i}`)
    }

    const wallets = hdPaths.map(hdPath => ethers.Wallet.fromMnemonic(mnemonic, hdPath)) 
    
    return wallets
}

module.exports = {wallets: getWallets()}