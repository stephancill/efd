import React from "react"
import { withRouter, Switch, Route, matchPath } from "react-router"
import { ethers } from "ethers"
import namehash from "eth-ens-namehash"

import deploymentMap from "../deployments/map.json"
import EFDArtifact from "../artifacts/contracts/EthereumFriendDirectory.sol/EthereumFriendDirectory.json"
import ReverseRecordsArtifact from "../artifacts/@ensdomains/reverse-records/contracts/ReverseRecords.sol/ReverseRecords.json"
import ENSRegistryArtifact from "../artifacts/@ensdomains/ens/contracts/ENSRegistry.sol/ENSRegistry.json"
import ResolverArtifact from "../artifacts/@ensdomains/resolver/contracts/Resolver.sol/Resolver.json"

import { NoWalletDetected } from "./NoWalletDetected"
import { Nav } from "./Nav"
import HeaderUser from "./HeaderUser"
import UserList from "./UserList"
import InvitePage from "./InvitePage"

import "./App.css"

// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '31337'

class Dapp extends React.Component {
  constructor(props) {
    super(props)

    this.initialState = {
      efd: undefined,
      reverseRecords: undefined,
      ensRegistry: undefined,
      resolverInterface: undefined,
      currentUser: undefined,
      displayedUser: undefined,
      searchQuery: "",
      userNotFound: false,
      ready: undefined,
    }

    this.state = this.initialState

    this._onSearch = this._onSearch.bind(this)
    this._onSearchChange = this._onSearchChange.bind(this)
    this._onSelectUser = this._onSelectUser.bind(this)
    this._userFromAddress = this._userFromAddress.bind(this)
    this._refreshCurrentUser = this._refreshCurrentUser.bind(this)
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />
    }

    if (!this.state.efd) {
      return <div>Loading...</div>
    }

    return (
      <div className="App">
        <Nav connectWallet={() => this._connectWallet()} 
          currentUser={this.state.currentUser}
          searchQuery={this.state.searchQuery}
          onSearchChange={this._onSearchChange}
          onSearchSubmit={this._onSearch}
        />
          <Switch>
            <Route path="/invite/:encodedInvite" render={(route) => {
              return <div style={{display: "flex", justifyContent: "center"}}>
                <InvitePage 
                  currentUser={this.state.currentUser} 
                  route={route} 
                  userFromAddress={this._userFromAddress} 
                  onSelectUser={this._onSelectUser} 
                  provider={this._provider}
                  efd={this.state.efd}
                  refreshCurrentUser={this._refreshCurrentUser}
                  >
                </InvitePage>
              </div>
              
            }}>
              
            </Route>
            <Route path="/account/:addressOrENS" render={ (route) => {
              return <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{marginTop: "50px"}}>
                  {
                    this.state.displayedUser ? <>
                      <HeaderUser 
                      user={this.state.displayedUser} 
                      currentUser={this.state.currentUser} 
                      provider={this._provider} 
                      efd={this.state.efd}/>
                      <UserList 
                      title="Friends" 
                      users={this.state.displayedUser.friends} 
                      onSelectUser={this._onSelectUser} 
                      emptyMessage={"Nothing to see here (yet!)"}
                      currentUser={this.state.currentUser}
                      />
                    </> : 
                    this.state.userNotFound ? <>
                      {route.match.params.addressOrENS} could not be found :/
                    </> : <></>
                  }
                </div>
              </div>
            }}></Route>
          </Switch>
      </div>
    )
  }

  async componentDidMount() {
    this._initialize()
  }

  componentDidUpdate(prevProps, prevState) {

    const { pathname } = this.props.location;
    const { pathname: prevPathname } = prevProps.location;
    const params = this._getParams(pathname)
    const prevParams = this._getParams(prevPathname)

    if (params.addressOrENS) {
      if (!prevState.ready && this.state.ready) {
        this.updateUser(params.addressOrENS)
        return
      }
      if (params.addressOrENS === prevParams.addressOrENS) {
        return
      }
      this.updateUser(params.addressOrENS)
    }
  }

  _getParams = (pathname) => {
    const matchProfile = matchPath(pathname, {
      path: `/account/:addressOrENS`,
    })
    return (matchProfile && matchProfile.params) || {}
  }

  async _hasAccountConnected() {
    const accounts = await window.ethereum.request({method: "eth_accounts"})
    return accounts.length > 0
  }

  async _connectWallet() {
    try {
      const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const currentUser = await this._userFromAddress(address)
      this.setState({currentUser})
    } catch (error) {
      
    }

    if (!this._checkNetwork()) {
      return
    }
  }

  async _initialize(currentUser) {
    this._provider = new ethers.providers.Web3Provider(window.ethereum)
    await this._loadContracts(this._provider)

    const isConnected = await this._hasAccountConnected()
    if (currentUser === undefined) {
      if (isConnected) {
        await this._connectWallet()
      }
    }

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress === undefined) {
        return this._resetState()
      }
      this._connectWallet()
    })
    
    window.ethereum.on("chainChanged", ([networkId]) => {
      this._resetState()
    })

    if (isConnected) {
      await this._loadContracts(this._provider.getSigner(0))
    }
  }

  async _loadContracts(providerOrSigner) {

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

    this.setState({
      efd,
      reverseRecords,
      ensRegistry,
      resolverInterface,
      ready: true
    })
  }

  async _onSelectUser(user) {
    this.props.history.push(`/account/${user.address}`)
  }

  async _onSearch(e) {
    e.preventDefault()
    this.props.history.push(`/account/${this.state.searchQuery}`)
  }

  async _onSearchChange(e) {
    this.setState({searchQuery: e.target.value})
  }

  async _refreshCurrentUser() {
    const currentUser = await this._userFromAddress(this.state.currentUser.address)
    this.setState({currentUser})
  } 

  async updateUser(addressOrENS) {
    
    if (this.state.displayedUser && (this.state.displayedUser.address === addressOrENS || this.state.displayedUser.ens === addressOrENS)
    ) {
      return
    }

    let user
    if (addressOrENS.slice(0,2) === "0x") {
      // TODO: Validate displayed address
      user = await this._userFromAddress(addressOrENS)
    } else {
      user = await this._userFromENS(addressOrENS)
    }

    if (!user) {
      if (!this.state.userNotFound) {
        this.setState({
          userNotFound: true,
          displayedUser: null
        })
      }
      return
    }

    this.setState({
      searchQuery: "",
      displayedUser: user, 
      userNotFound: false
    })
  }

  async _userFromENS(name) {
    const hash = namehash.hash(name)
    const resolverAddress = await this.state.ensRegistry.resolver(hash)

    if (resolverAddress === ethers.constants.AddressZero) {
      return null
    }

    const userAddress = await this.state.resolverInterface.attach(resolverAddress)["addr(bytes32)"](hash)
    const user = await this._userFromAddress(userAddress)
    
    return user
  }

  async _userFromAddress(address) {
    console.log("call")
    const [adj] = await this.state.efd.getAdj(address)
    const allAddresses = [address, ...adj]
    const allNames = await this.state.reverseRecords.getNames(allAddresses) // TODO: Some kind of caching
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

  _dismissNetworkError() {
    this.setState({ networkError: undefined })
  }

  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message
    }

    return error.message
  }

  _resetState() {
    this.setState(this.initialState)
    this._initialize()
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Localhost:8545'
    })

    return false
  }
}

export default {
  Dapp: withRouter(Dapp)
}