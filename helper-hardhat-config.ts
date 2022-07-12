export const HARDHAT_LOCALHOST_CHAIN_ID = 31337;
export const MUMBAI_CHAIN_ID = 80001;

export const DEVELOPMENT_CHAINS = ["hardhat", "localhost"];

export interface networkConfigItem {
  mintFeeCents: number;
  maticUsdPriceFeed?: string;
  blockConfirmations?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {
    mintFeeCents: 100,
  },
  hardhat: {
    mintFeeCents: 100,
  },
  mumbai: {
    maticUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    blockConfirmations: 6,
    mintFeeCents: 100,
  },
};
