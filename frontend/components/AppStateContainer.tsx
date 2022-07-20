import React, { FC, PropsWithChildren } from "react";
import { useNetwork } from "wagmi";
import {
  ENV_DEVELOPMENT,
  HARDHAT_LOCALHOST_CHAIN_ID,
  POLYGON_TEST_MUMBAI_CHAIN_ID,
} from "../utils/constants";
import unTypedContractsConfig from "../utils/chainsConfig.json";

interface ChainConfig {
  contractAddress: string;
  blockConfirmations: number;
  blockExplorerUrl: string;
  contractDeployBlockNum: number;
}

const chainsConfig: { [id: string]: ChainConfig } = unTypedContractsConfig;

let defaultChainConfig: ChainConfig;
if (process.env.NEXT_PUBLIC_ENV === ENV_DEVELOPMENT) {
  defaultChainConfig = chainsConfig[POLYGON_TEST_MUMBAI_CHAIN_ID];
} else {
  defaultChainConfig = chainsConfig[HARDHAT_LOCALHOST_CHAIN_ID];
}

export const ChainConfigContext = React.createContext<ChainConfig>(defaultChainConfig);

const AppStateContainer: FC<PropsWithChildren> = ({ children }) => {
  const { chain } = useNetwork();

  const chainConfig =
    chain?.id && chain.id.toString() in chainsConfig
      ? chainsConfig[chain.id.toString()]
      : defaultChainConfig;
  return <ChainConfigContext.Provider value={chainConfig}>{children}</ChainConfigContext.Provider>;
};

export default AppStateContainer;
