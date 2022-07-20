export const HARDHAT_LOCALHOST_CHAIN_ID = 31337;
export const POLYGON_TEST_MUMBAI_CHAIN_ID = 80001;

export const DEVELOPMENT_CHAINS = ["hardhat", "localhost"];

export const MICRO_USD_DECIMALS = 1e6;

export const MINT_FEES_USD = 0.05;

export interface NetworkConfigItem {
  mintFeeMicroUsd: number;
  usdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface NetworkConfigInfo {
  [key: string]: NetworkConfigItem;
}

export const networkConfig: NetworkConfigInfo = {
  localhost: {
    mintFeeMicroUsd: MINT_FEES_USD * MICRO_USD_DECIMALS,
  },
  hardhat: {
    mintFeeMicroUsd: MINT_FEES_USD * MICRO_USD_DECIMALS,
  },
  mumbai: {
    usdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    blockConfirmations: 6,
    mintFeeMicroUsd: MINT_FEES_USD * MICRO_USD_DECIMALS,
  },
};

export const frontEndContractsFile = "./frontend/utils/chainsConfig.json";
export const frontEndAbiFile = "./frontend/utils/abi.json";
