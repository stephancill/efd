// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract EthereumFriendDirectory {
    using ECDSA for *;
    using EnumerableSet for EnumerableSet.AddressSet;
    using SignatureChecker for *;

    mapping (address=>EnumerableSet.AddressSet) adj;

    event Confirmed(address fromAddress, address toAddress);   

    constructor() {                  
        // adj[msg.sender].add(address(0));      
    }    

    function confirmRequest(address fromAddress, address toAddress, bytes memory senderSig, bytes memory acceptorSig) public {
        bytes32 requestHash = keccak256(abi.encodePacked(fromAddress, toAddress)).toEthSignedMessageHash();       
        require(SignatureChecker.isValidSignatureNow(fromAddress, requestHash, senderSig), "Invalid sender");

        bytes32 acceptHash = keccak256(abi.encodePacked(fromAddress, toAddress, senderSig)).toEthSignedMessageHash();
        require(SignatureChecker.isValidSignatureNow(toAddress, acceptHash, acceptorSig), "Invalid acceptor");
        
        require(!adj[fromAddress].contains(toAddress) || !adj[toAddress].contains(fromAddress), "Already adj");

        emit Confirmed(fromAddress, toAddress);

        adj[fromAddress].add(toAddress);
        adj[toAddress].add(fromAddress);
    }

    function getAdj(address user) view public returns (address[] memory, uint256) {
        EnumerableSet.AddressSet storage set = adj[user];
        address[] memory addresses = new address[](set.length());
        for (uint i = 0; i < set.length(); i++) {
            addresses[i] = set.at(i);
        }
        return (addresses, addresses.length);
    }
}