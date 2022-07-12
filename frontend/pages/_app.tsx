import "antd/dist/antd.variable.min.css";
import "../styles/global.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, useNetwork, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { ConfigProvider } from "antd";
import { PRIMARY_COLOR } from "../utils/constants";
import React, { FC, PropsWithChildren } from "react";
import contractsConfig from "../utils/contractsConfig.json";
import AppStateContainer from "../components/AppStateContainer";
import { infuraProvider } from "wagmi/providers/infura";

ConfigProvider.config({
  theme: {
    primaryColor: PRIMARY_COLOR,
  },
});

/**
 * TODO:
 * - Order of chains matter, will choose the first chain as default to connect to for the wallet
 * - publicProvider is also dependent on the chain
 * - use env var to selectively configure chains and contract addresses
 */
const { chains, provider } = configureChains(
  [chain.hardhat, chain.polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Poco",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={lightTheme({ accentColor: PRIMARY_COLOR })} chains={chains}>
        <div>
          <Head>
            <title>POCO</title>
            <meta
              name="description"
              content="POCO is a decentralized app to issue digital certificates for physical products in order to combat counterfeiting and facilitate traceability."
            />
            <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
          </Head>
          <AppStateContainer>
            <Component {...pageProps} />
          </AppStateContainer>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
