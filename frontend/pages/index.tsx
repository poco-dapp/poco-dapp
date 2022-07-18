import { Col, Row, Space } from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import { css } from "@emotion/react";
import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useAccount, useContract, useProvider } from "wagmi";

import { Event } from "ethers";
import ProductForm from "../components/ProductForm";
import Instructions from "../components/Instructions";
import NftRecordList, { LogEvent } from "../components/NftRecordList";
import Navbar from "../components/Navbar";
import { ChainConfigContext } from "../components/AppStateContainer";
import { useWalletConnection } from "../utils/custom-hooks";
import abi from "../utils/abi.json";

const Home: NextPage = () => {
  const [logEvents, setLogEvents] = useState<LogEvent[]>([]);
  const isWalletConnected = useWalletConnection();
  const chainConfig = useContext(ChainConfigContext);
  const provider = useProvider();
  const { address: walletAddress } = useAccount();

  const pocoNftContract = useContract({
    addressOrName: chainConfig?.address,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  useEffect(() => {
    if (isWalletConnected) {
      setLogEvents([]);
      getAllNftsMintedAndSubscribe();
    }

    return () => {
      unsubscribeAllEvents();
    };
  }, [isWalletConnected, walletAddress]);

  const getAllNftsMintedAndSubscribe = async () => {
    const nftMintedEventFilter = pocoNftContract.filters.NftMinted(walletAddress);

    const events: Event[] = await pocoNftContract.queryFilter(
      nftMintedEventFilter,
      "earliest",
      "latest"
    );

    const logEvents = await Promise.all(
      events.map(async (event) => {
        const block = await provider.getBlock(event.blockNumber);
        return {
          event,
          block,
        };
      })
    );

    setLogEvents([...logEvents.reverse()]);

    const latestBlockNumber = await provider.getBlockNumber();

    provider.once("block", () => {
      pocoNftContract.on(
        nftMintedEventFilter,
        async (minter: string, nftUid: string, nftUri: string, event: Event) => {
          if (event.blockNumber <= latestBlockNumber) {
            // Ignore old blocks;
            return;
          }

          const block = await provider.getBlock(event.blockNumber);

          setLogEvents((oldLogEvents) => [{ event, block }, ...oldLogEvents]);
        }
      );
    });
  };

  const unsubscribeAllEvents = () => {
    provider.removeAllListeners();
    pocoNftContract.removeAllListeners();
  };

  return (
    <div>
      <Navbar />
      <Content
        css={css`
          padding-top: 32px;
        `}
      >
        <Row justify="space-evenly">
          <Col span={6}>
            <Instructions />
          </Col>
          <Col span={6}>
            <ProductForm />
          </Col>
          {isWalletConnected && logEvents.length > 0 && (
            <Col span={6}>
              <NftRecordList logEvents={logEvents} />
            </Col>
          )}
        </Row>
      </Content>
      <Footer>
        <Space
          css={css`
            padding-bottom: 48px;
            text-align: center;
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 16px;
          `}
        >
          <a href="https://github.com/poco-dapp/poco-dapp">Source code</a>
          <span>/</span>
          <a href={`${chainConfig.blockExplorerUrl}/address/${chainConfig.address}`}>
            Deployed Contract
          </a>
          <span>/</span>
          <a href="https://github.com/poco-dapp/poco-dapp/discussions">Give Feedback</a>
          <span>/</span>
          <a href="https://faucet.polygon.technology/">Get Test Tokens</a>
        </Space>
      </Footer>
    </div>
  );
};

export default Home;
