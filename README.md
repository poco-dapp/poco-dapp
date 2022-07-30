# POCO Dapp

POCO is a **decentralized app** to store
**Proof of Certification and Ownership information**, as ERC-721 NFTs, for
**physical products** to combat counterfeiting and facilitate traceability.

Since the app uses a public blockchain and filesystem - [Polygon](https://polygonscan.com/) and [IPFS](https://ipfs.io/), all product information and documents submitted will always be available without
restriction.

## Local Setup

### Deploy contracts to localhost network

```
# Instal Dependencies
yarn install

# Set up environment variables
cp .env.example .env

# Run localhost chain
yarn hardhat node

# Compile and deploy contracts and generate the abi for frontend
yarn hardhat deploy --network localhost
```

### Run frontend

```
# Change directory
cd frontend

# Install dependencies
yarn install

# Set up environment variables
cp env/.env.example env/.env.local

# Start frontend
yarn dev
```

### Setup local Graph and IPFS nodes

```
# Clone the graph-node
git clone git@github.com:graphprotocol/graph-node.git

# Run the dockerized Graph and IPFS nodes
cd docker && docker-compose up -d
```

Note: To setup the CORS headers for local IPFS node, follow [this solution](https://stackoverflow.com/questions/42708251/how-to-do-cross-origin-requests-on-ipfs)

```
# Update IPFS config
docker-compose exec ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

# Restart IPFS node
docker-compose restart ipfs
```

## Deployments

### Contract Addresses

- Polygon Testnet (Mumbai) - [0xA29111ef1bb594f6f12e4C2b570574bEb6f39F1d](https://mumbai.polygonscan.com/address/0xa29111ef1bb594f6f12e4c2b570574beb6f39f1d#code)
  - Get test tokens at [Polygon Facuet](https://faucet.polygon.technology/)

### Web Interface

- https://poco-dapp.on.fleek.co/
- IPFS/IPNS - https://poco--dapp-on-fleek-co.ipns.dweb.link/

## To-dos

- Look for a simple wallet app for organizations to allow them to easily use this dapp. Ideally, the wallet app should be open-source and non-custodial and have some of the requisite enterprise-level features such as mult-user accounts, audit logs and access control.

#### Appreciate any feedback to improve and further develop this dapp - [Twitter](https://twitter.com/sgzsh269) / [Discussions](https://github.com/poco-dapp/poco-dapp)
