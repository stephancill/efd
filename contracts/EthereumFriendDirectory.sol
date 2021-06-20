// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.7.0;

import "./EnumerableSet.sol";
import "./SignatureUtils.sol";

contract EthereumFriendDirectory {
    using EnumerableSet for EnumerableSet.AddressSet;
    using SignatureUtils for *;

    mapping (address=>EnumerableSet.AddressSet) adj;

    constructor() public {                  
        adj[msg.sender].add(address(0));      
    }    

    function toBytes(string memory a) public pure returns (bytes memory) {
        return abi.encodePacked(a);
    }

    function concat(bytes32 b1, bytes32 b2) public pure returns (bytes memory) {
        bytes memory result = new bytes(64);
        assembly {
            mstore(add(result, 32), b1)
            mstore(add(result, 64), b2)
        }
        return result;
    }

    function createRequest(address user) public returns (bytes32) {
        bytes32 signature = SignatureUtils.toEthPersonalSignedMessageHash("request");
        return signature;
    }

    function acceptRequest(address requester, bytes32 requestSignature) public  returns (bytes memory) {
        bytes32 acceptSignature = SignatureUtils.toEthPersonalSignedMessageHash("request");
        bytes memory confirmSignature = concat(acceptSignature, requestSignature);
        return confirmSignature;
    }

    function confirmRequest(bytes memory confirmSignature) public returns (bool) {
        require(SignatureUtils.countSignatures(confirmSignature) == 2, "Exactly 2 signatures required");

        address[] memory addresses = SignatureUtils.recoverAddresses(SignatureUtils.toEthPersonalSignedMessageHash("request"), confirmSignature);
        require(addresses.length == 2);

        adj[addresses[0]].add(addresses[1]);
        adj[addresses[1]].add(addresses[2]);

        return true;
    }

    function getAdj(address user) public returns (address[] memory, uint256) {
        EnumerableSet.AddressSet storage set = adj[user];
        address[] memory addresses;
        for (uint i = 0; i < set.length(); i++) {
            addresses[i] = set.at(i);
        }
        return (addresses, addresses.length);
    }
}