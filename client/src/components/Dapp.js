import React, {useState, useEffect} from "react"

import { ethers } from "ethers"
import namehash from "eth-ens-namehash"

import deploymentMap from "../deployments/map.json"
import EFDArtifact from "../artifacts/contracts/EthereumFriendDirectory.sol/EthereumFriendDirectory.json"
import ReverseRecordsArtifact from "../artifacts/@ensdomains/reverse-records/contracts/ReverseRecords.sol/ReverseRecords.json"
import ENSRegistryArtifact from "../artifacts/@ensdomains/ens/contracts/ENSRegistry.sol/ENSRegistry.json"
import ResolverArtifact from "../artifacts/@ensdomains/resolver/contracts/Resolver.sol/Resolver.json"

import { NoWalletDetected } from "./NoWalletDetected"
import { Loading } from "./Loading"
import { Nav } from "./Nav"
import HeaderUser from "./HeaderUser"
import UserList from "./UserList"

import "./App.css"

// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '31337'

export function Dapp() {
  const [efd, setefd] = useState(undefined)
  const [reverseRecords, setreverseRecords] = useState(undefined)
  const [ensRegistry, setensRegistry] = useState(undefined)
  const [resolverInterface, setresolverInterface] = useState(undefined)
  const [currentUser, setcurrentUser] = useState(undefined)
  const [displayedUser, setdisplayedUser] = useState(undefined)
  const [searchQuery, setsearchQuery] = useState("")

  useEffect(() => {
    _initialize()
  }, [])

  const _hasAccountConnected = async () => {
    const accounts = await window.ethereum.request({method: "eth_accounts"})
    return accounts.length > 0
  }

  const _connectWallet = async () => {
    console.log("hello")
    try {
      const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const currentUser = await _userFromAddress(address)
      setcurrentUser(currentUser)
    } catch (error) {
      
    }

    if (!_checkNetwork()) {
      return
    }
  }

  const _initialize = async (currentUser) => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum)
    await _loadContracts(_provider)

    const isConnected = await _hasAccountConnected()
    if (currentUser === undefined) {
      if (isConnected) {
        await _connectWallet()
      }
    }

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress === undefined) {
        
        _resetState()
        return
      }
      _connectWallet()
    })
    
    window.ethereum.on("chainChanged", ([networkId]) => {
      _resetState()
    })

    if (isConnected) {
      await _loadContracts(_provider.getSigner(0))
    }
  }

  const _loadContracts = async (providerOrSigner) => {

    let chainId = await window.ethereum.request({ method: 'eth_chainId' })
    chainId = parseInt(chainId)

    const efd = new ethers.Contract(
      deploymentMap.contracts[chainId].EthereumFriendDirectory[0],
      EFDArtifact.abi,
      providerOrSigner
    )

    const reverseRecords = new ethers.Contract(
      deploymentMap.contracts[chainId].ReverseRecords[0],
      ReverseRecordsArtifact.abi,
      providerOrSigner
    )

    
    const ensRegistry = new ethers.Contract(
      deploymentMap.contracts[chainId].ENS[0],
      ENSRegistryArtifact.abi,
      providerOrSigner
    )

    const resolverInterface = new ethers.Contract(
      deploymentMap.contracts[chainId].PublicResolver[0],
      ResolverArtifact.abi, 
      providerOrSigner
    )

    setefd(efd)
    setreverseRecords(reverseRecords)
    setensRegistry(ensRegistry)
    setresolverInterface(resolverInterface)
  }

  const _onSearch = async (e) => {
    e.preventDefault()

    if (searchQuery.length === 0) {
      return
    }

    let user
    if (searchQuery.slice(0,2) === "0x") {
      // TODO: Validate displayed address
      user = await _userFromAddress(searchQuery)
    } else {
      user = await _userFromENS(searchQuery)
    }
    
    setsearchQuery("")
    setdisplayedUser(user)
  }

  const _onSearchChange = (e) => {
    setsearchQuery(e.target.value)
  }

  const _userFromENS = async (name) => {
    const hash = namehash.hash(name)
    const resolverAddress = await ensRegistry.resolver(hash)
    const userAddress = await resolverInterface.attach(resolverAddress)["addr(bytes32)"](hash)
    const user = await _userFromAddress(userAddress)
    return user
  }

  const _userFromAddress = async (address) => {
    /** 
     * 1. Get adj
     * 2. Resolve user + adj addresses
     */

    const [adj] = await efd.getAdj(address)
    const allAddresses = [address, ...adj]
    const allNames = await reverseRecords.getNames(allAddresses)
    // const validNames = allNames.filter((n) => namehash.normalize(n) === n)
    // TODO: Reverse lookup all names
     
    const ensMapping = {}
    allAddresses.forEach((a, i) => {
      ensMapping[a] = allNames[i] || null
    })

    return {
      ens: ensMapping[address],
      friends: adj.map(a => {return {ens: ensMapping[a], address: a}}),
      address
    }
  }

  const _resetState = () => {
    setefd(undefined)
    setreverseRecords(undefined)
    setensRegistry(undefined)
    setresolverInterface(undefined)
    setcurrentUser(undefined)
    setdisplayedUser(undefined)
    setsearchQuery("")
    _initialize()
  }

  const _checkNetwork = () => {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true
    }

    return false
  }

  if (window.ethereum === undefined) {
    return <NoWalletDetected />
  }

  if (!efd) {
    return <Loading />
  }

  return (
    <div className="App">
      <Nav connectWallet={_connectWallet} 
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={_onSearchChange}
        onSearchSubmit={_onSearch}
        />
      <div style={{display: "flex", justifyContent: "center"}}>
        <div style={{marginTop: "50px"}}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{marginLeft: "-40px"}}>
              {
                displayedUser ? <HeaderUser user={displayedUser} currentUser={currentUser}/> : <></>
              }
              
            </div>
          </div>
          {
            displayedUser ? <UserList title="Friends" users={displayedUser.friends}></UserList> : <></>
          }
          
        </div>
      </div>
    </div>
  )
}
