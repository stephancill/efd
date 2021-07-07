const credentials = require("./credentials.json")

const commonConfig = {
  etherscan: {
    apiKey: credentials.ETHERSCAN_API_KEY
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:9545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      }
    }
  }
}

module.exports = commonConfig