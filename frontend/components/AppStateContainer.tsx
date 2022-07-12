import React, { FC, PropsWithChildren } from "react";
import { useNetwork } from "wagmi";
import contractsConfig from "../utils/contractsConfig.json";

interface ChainConfig {
  address: string;
  blockConfirmations: number;
}

const DEFAULT_CHAIN_CONFIG: ChainConfig = contractsConfig["31337"]; // TODO: use env var to selectively configure chains and contract addresses

export const ChainConfigContext = React.createContext<ChainConfig>(DEFAULT_CHAIN_CONFIG);

const AppStateContainer: FC<PropsWithChildren> = ({ children }) => {
  const { chain } = useNetwork();

  const chainConfig =
    chain?.id && chain.id.toString() in contractsConfig
      ? contractsConfig[chain.id.toString()]
      : DEFAULT_CHAIN_CONFIG;
  return <ChainConfigContext.Provider value={chainConfig}>{children}</ChainConfigContext.Provider>;
};

export default AppStateContainer;
