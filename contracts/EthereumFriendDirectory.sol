// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.7.0;

import "OpenZeppelin/openzeppelin-contracts@3.0.0/contracts/utils/EnumerableSet.sol";

contract EthereumFriendDirectory {
    using EnumerableSet for EnumerableSet.AddressSet;

    mapping (address=>EnumerableSet.AddressSet) adj;
}