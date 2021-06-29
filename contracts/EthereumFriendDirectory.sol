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
    event Removed(address userAddress, address removedAddress, bool wasPresent);   

    function hashRequest(address fromAddress, address toAddress) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(fromAddress, toAddress));
    }

    function hashAccept(address fromAddress, address toAddress, bytes calldata senderSig) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(fromAddress, toAddress, senderSig));
    }

    function confirmRequest(address fromAddress, address toAddress, bytes calldata senderSig, bytes calldata acceptorSig) public {
        require(fromAddress != toAddress, "Addresses cannot be the same");

        bytes32 requestHash = hashRequest(fromAddress, toAddress).toEthSignedMessageHash();   
        require(SignatureChecker.isValidSignatureNow(fromAddress, requestHash, senderSig), "Invalid sender");

        bytes32 acceptHash = hashAccept(fromAddress, toAddress, senderSig).toEthSignedMessageHash();
        require(SignatureChecker.isValidSignatureNow(toAddress, acceptHash, acceptorSig), "Invalid acceptor");

        emit Confirmed(fromAddress, toAddress);

        adj[fromAddress].add(toAddress);
        adj[toAddress].add(fromAddress);
    }

    function removeAdj(address addressToRemove) public {
        bool removed1 = adj[msg.sender].remove(addressToRemove);
        bool removed2 = adj[addressToRemove].remove(msg.sender);
        emit Removed(msg.sender, addressToRemove, removed1 || removed2);
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