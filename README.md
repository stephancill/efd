# 🌈 Ethereum Friend Directory

Ethereum Friend Directory is a blockchain-based social graph which allows users to maintain a list of mutual connections. This list of connections can be accessed by any app on the decentralized web to allow for social use cases e.g. a portable following/follower list.

## How it works

Requests are created and accepted off-chain. This is the most cost-effective way of facilitating this interaction. An implementation of these methods can be found in the tests directory.

1. Alice creates a request by signing the hash of a message which contains her and Bob's address and sends it to Bob
2. Bob signs the same message with Alice's signature added in
3. Bob or Alice can confirm the request at any time by submitting it to the contract's `confirmRequest` method
4. Bob's address is added to Alice's set in the `adj` mapping and Alice to Bob's

- The adjacency matrix `adj` is read by the client to display who is friends with who.
- ENS is used to resolve ENS domains and profile images 

### Progress
- [ ] Design - [Figma](https://www.figma.com/file/T8AoUKQ0UNE5qTtftqg7nL/Ethereum-Friend-Directory?node-id=0%3A1)
    - [x] Concept mapped out
- [ ] Contract
    - [x] Confirm request accept
    - [x] Remove friends
    - [ ] Batch confirm
    - [ ] Batch remove
- [ ] Frontend
    - [x] Basic components
    - [x] Connect/switch account and view profile
    - [x] Profile url
    - [x] ENS reverse resolution - [ENS Docs](https://docs.ens.domains/dapp-developer-guide/resolving-names#reverse-resolution)
    - [ ] Requests
        - [x] Create signature that you can send to someone 
        - [x] Route to sign request to accept
        - [ ] Route to publish friend confirmation
    - [x] Remove friends
    - [x] View other accounts
    - [ ] UX improvements
        - [ ] Button hover states
        - [ ] Button loading states
        - [ ] Page loading states
- [ ] Testing
    - [x] Create ENS task
    - [ ] Set profile image
- [ ] Deploy

Reach out on Twitter [@stephancill](https://twitter.com/stephancill) if you'd like to help out or make a PR.



## Installation

```
yarn
```

## Development

### Contract
```
yarn run node
```

In a separate terminal, to generate random data for the built in accounts:
```
yarn dev
```

### Client
```
cd client
yarn start
```
## Tests
```
yarn test
```