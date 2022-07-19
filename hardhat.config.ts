import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";

import "./tasks/interactWithPocoNft";

import { POLYGON_TEST_MUMBAI_CHAIN_ID, HARDHAT_LOCALHOST_CHAIN_ID } from "./helper-hardhat-config";

dotenv.config();

const POLYGON_TEST_MUMBAI_NODE_URL = process.env.POLYGON_TEST_MUMBAI_NODE_URL || "";
const POLYGON_TEST_MUMBAI_PRIVATE_KEY = process.env.POLYGON_TEST_MUMBAI_PRIVATE_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const REPORT_GAS = process.env.REPORT_GAS;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: HARDHAT_LOCALHOST_CHAIN_ID,
    },
    mumbai: {
      url: POLYGON_TEST_MUMBAI_NODE_URL,
      accounts:
        POLYGON_TEST_MUMBAI_PRIVATE_KEY !== undefined ? [POLYGON_TEST_MUMBAI_PRIVATE_KEY] : [],
      chainId: POLYGON_TEST_MUMBAI_CHAIN_ID,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS !== undefined,
    currency: "USD",
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user1: {
      default: 1,
    },
    user2: {
      default: 2,
    },
  },
};

export default config;
