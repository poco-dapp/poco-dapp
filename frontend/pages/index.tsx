import type { NextPage } from "next";
import {
  Button,
  Col,
  Menu,
  MenuProps,
  Row,
  Input,
  Space,
  Form,
  InputNumber,
  Upload,
  UploadFile,
  Typography,
  Steps,
  List,
  Alert,
  Tag,
} from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import styled from "@emotion/styled";
import TextArea from "antd/lib/input/TextArea";
import { css, jsx } from "@emotion/react";
import { UploadOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { PRIMARY_COLOR } from "../utils/constants";
import {
  useAccount,
  useNetwork,
  useContractWrite,
  useContractEvent,
  useContract,
  useProvider,
  useContractRead,
} from "wagmi";
import { NftMetadata, uploadFileToIpfs, uploadMetaDataToIpfs } from "../utils/ipfs-helper";
import { openNotificationWithIcon } from "../utils/notification-helper";
import { Uid } from "../utils/uid-generator";

import { Contract, ethers } from "ethers";
import { getAppFeesInMatic } from "../utils/app-fees-helper";
import ProductForm from "../components/ProductForm";
import Instructions from "../components/Instructions";
import NftRecordList, { LogEvent } from "../components/NftRecordList";
import Navbar from "../components/Navbar";
import { ChainConfigContext } from "../components/AppStateContainer";
import useWalletConnection from "../utils/custom-hooks";
import abi from "../utils/abi.json";

const { Title, Text } = Typography;
const { Search } = Input;

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

    const events = await pocoNftContract.queryFilter(nftMintedEventFilter, "earliest", "latest");

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
      pocoNftContract.on(nftMintedEventFilter, async (minter, nftUid, nftUri, event) => {
        if (event.blockNumber <= latestBlockNumber) {
          // Ignore old blocks;
          return;
        }

        const block = await provider.getBlock(event.blockNumber);

        setLogEvents((oldLogEvents) => [{ event, block }, ...oldLogEvents]);
      });
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
    </div>
  );
};

export default Home;
