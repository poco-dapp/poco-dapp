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
  @import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap");
  html,
  body {
    font-family: "Work Sans", sans-serif;
    background: #f5f6f7;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    /* opacity: 0.7;
    background-image: radial-gradient(#4745f7 0.5px, transparent 0.5px),
      radial-gradient(#4745f7 0.5px, #f5f6f7 0.5px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px; */
  }

  .ant-btn {
    border-radius: 10px;
  }

  .ant-input {
    border-radius: 4px;
  }

  .ant-card {
    border-radius: 8px;
  }

  .ant-typography a,
  a.ant-typography {
    text-decoration: underline;
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
              content="POCO is a public blockchain app to transparently store product attributes information in order to facilitate authentication, compliance check and traceability of physical products."
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
