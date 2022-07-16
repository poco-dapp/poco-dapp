import React, { FC, PropsWithChildren } from "react";
import { useNetwork } from "wagmi";
import {
  ENV_DEVELOPMENT,
  HARDHAT_LOCALHOST_CHAIN_ID,
  POLYGON_TEST_MUMBAI_CHAIN_ID,
} from "../utils/constants";
import unTypedContractsConfig from "../utils/contractsConfig.json";

interface ChainConfig {
  address: string;
  blockConfirmations: number;
}

const contractsConfig: { [id: string]: ChainConfig } = unTypedContractsConfig;

let defaultChainConfig: ChainConfig;
if (process.env.NEXT_PUBLIC_ENV === ENV_DEVELOPMENT) {
  defaultChainConfig = contractsConfig[POLYGON_TEST_MUMBAI_CHAIN_ID];
} else {
  defaultChainConfig = contractsConfig[HARDHAT_LOCALHOST_CHAIN_ID];
}

export const ChainConfigContext = React.createContext<ChainConfig>(defaultChainConfig);

const AppStateContainer: FC<PropsWithChildren> = ({ children }) => {
  const { chain } = useNetwork();

  const chainConfig =
    chain?.id && chain.id.toString() in contractsConfig
      ? contractsConfig[chain.id.toString()]
      : defaultChainConfig;
  return <ChainConfigContext.Provider value={chainConfig}>{children}</ChainConfigContext.Provider>;
};

export default AppStateContainer;
