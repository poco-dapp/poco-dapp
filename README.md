# POCO Dapp

POCO is a **decentralized app** to store
**Proof of Certification and Ownership information**, as ERC-721 NFTs, for
**physical products** to combat counterfeiting and facilitate traceability.

Since the app uses a public blockchain and filesystem - **Polygon and IPFS**, all product information and documents submitted will always be available without
restriction.

## Setup

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
# Install dependencies
yarn install

# Start frontend
yarn dev
```
