import "antd/dist/antd.variable.min.css";
import "../styles/global.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { ConfigProvider } from "antd";
import React from "react";
import { ENV_DEVELOPMENT, PRIMARY_COLOR } from "../utils/constants";
import AppStateContainer from "../components/AppStateContainer";

ConfigProvider.config({
  theme: {
    primaryColor: PRIMARY_COLOR,
  },
});

let chainsEnabled: Chain[];
if (process.env.NEXT_PUBLIC_ENV === ENV_DEVELOPMENT) {
  chainsEnabled = [chain.polygonMumbai, chain.hardhat];
} else {
  chainsEnabled = [chain.hardhat, chain.polygonMumbai];
}

const { chains, provider } = configureChains(chainsEnabled, [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "POCO",
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
