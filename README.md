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

## Deployments

### Contract Addresses

- Polygon Testnet (Mumbai) - [0xA29111ef1bb594f6f12e4C2b570574bEb6f39F1d](https://mumbai.polygonscan.com/address/0xa29111ef1bb594f6f12e4c2b570574beb6f39f1d#code)

### Frontend

https://poco-dapp.on.fleek.co/
