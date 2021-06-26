# 🌈 Ethereum Friend Directory

![Logo](./client/src/logo.svg)

Ethereum Friend Directory (EFD for short) is a blockchain-based graph which allows users to maintain a list of friend accounts. This allows you to take your contact list with you wherever you go on the decentralized web and also serves as a layer of proof of humanity. 

## How it works

Requests are created and accepted off-chain. This is the most cost-effective way of facilitating this interaction. An implementation of these methods can be found in the tests directory.

1. Alice creates a request by signing the hash of a message which contains her and Bob's address and sends it to Bob
2. Bob signs the same message with Alice's signature added in
3. Bob or Alice can confirm the request at any time by submitting it to the contract's `confirmRequest` method
4. Bob's address is added to Alice's set in the `adj` mapping and Alice to Bob's

- The adjacency matrix `adj` is read by the client to display who is friends with who.
- ENS is used to resolve ENS domains and profile images 

### Progress:
- [ ] Design - [Figma](https://www.figma.com/file/T8AoUKQ0UNE5qTtftqg7nL/Ethereum-Friend-Directory?node-id=0%3A1)
    - [x] Concept mapped out
- [ ] Contract
    - [x] Confirm request accept
    - [ ] Remove friends
- [ ] Frontend
    - [x] Basic components
    - [ ] Connect/switch account and view profile
    - [ ] ENS reverse resolution - [ENS Docs](https://docs.ens.domains/dapp-developer-guide/resolving-names#reverse-resolution)
    - [ ] Requests
        - [ ] Create signature that you can send to someone 
        - [ ] Route to sign request to accept
        - [ ] Route to publish friend confirmation
    - [x] View other accounts
- [ ] Testing
    - [x] Create ENS task
    - [ ] Set profile image
- [ ] Deploy

Reach out on Twitter [@stephancill](https://twitter.com/stephancill) if you'd like to help out or make a PR.



## Installation

`yarn`

## Development

### Contract
`yarn run node`

In a separate terminal:

`yarn deploy`

### Client
`cd client`

`yarn start`

## Tests

`yarn test`