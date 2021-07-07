const { ethers, web3 } = require("hardhat")
const { OptimismProvider } = require("@eth-optimism/provider")

async function main() {

  web3.setProvider()

  const l1Provider = new ethers.providers.JsonRpcProvider("http://localhost:9545")
  const l2Provider = new OptimismProvider("http://localhost:8545", new ethers.providers.Web3Provider(web3.currentProvider) )

  const l1Signer = l1Provider.getSigner(2)
  const l2Signer = l2Provider.getSigner(2)

  let l1Sig, l2Sig
  try {
    l1Sig = await l1Signer.signMessage("hello")
    l2Sig = await l2Signer.signMessage("hello")
  } catch (error) {
    console.error(error)
  }

  console.log("L1 Signature", l1Sig)
  console.log("L2 Signature", l2Sig)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })