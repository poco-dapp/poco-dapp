import "antd/dist/antd.variable.min.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { ConfigProvider } from "antd";
import React from "react";
import { css, Global } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ENV_DEVELOPMENT, PRIMARY_COLOR } from "../utils/constants";
import AppStateContainer from "../components/AppStateContainer";

ConfigProvider.config({
  theme: {
    primaryColor: PRIMARY_COLOR,
  },
});

const GlobalStyles = css`
  @import url("https://rsms.me/inter/inter.css");
  html,
  body {
    font-family: "Inter", sans-serif;
  }

  .ant-btn {
    border-radius: 10px;
  }

  .ant-input {
    border-radius: 4px;
  }
`;

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
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={lightTheme({ accentColor: PRIMARY_COLOR })} chains={chains}>
        <div>
          <Global styles={GlobalStyles} />
          <Head>
            <title>POCO</title>
            <meta
              name="description"
              content="POCO is a decentralized app to issue digital certificates for physical products in order to combat counterfeiting and facilitate traceability."
            />
            <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
          </Head>
          <AppStateContainer>
            <QueryClientProvider client={queryClient}>
              <Component {...pageProps} />
            </QueryClientProvider>
          </AppStateContainer>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
