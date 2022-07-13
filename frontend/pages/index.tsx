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
} from "wagmi";
import { NftMetadata, uploadFileToIpfs, uploadMetaDataToIpfs } from "../utils/ipfs-helper";
import { openNotificationWithIcon } from "../utils/notification-helper";
import { Uid } from "../utils/uid-generator";

import abi from "../utils/abi.json";
import { Contract, ethers } from "ethers";
import { getAppFeesInMatic } from "../utils/app-fees-helper";
import ProductForm from "../components/ProductForm";
import Instructions from "../components/Instructions";
import NftRecordList from "../components/NftRecordList";
import Navbar from "../components/Navbar";
import { ChainConfigContext } from "../components/AppStateContainer";
import useWalletConnection from "../utils/custom-hooks";

const { Title } = Typography;
const { Search } = Input;

const Home: NextPage = () => {
  const [nftRecordList, setNftRecordList] = useState([]);
  const isWalletConnected = useWalletConnection();

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
            <Space direction="vertical">
              <Alert
                type="info"
                description={
                  <Space direction="vertical">
                    <div>
                      Submit information about your physical product to register it on the Polygon
                      public blockchain
                    </div>
                    <div>
                      For each form submission, the app charges $1 fee in Polygon's MATIC token so
                      ensure your wallet has enough to cover app fees ($1) and blockchain
                      transaction fees ($0.10 - $0.50)
                    </div>
                  </Space>
                }
              />
              <ProductForm />
            </Space>
          </Col>
          {isWalletConnected && nftRecordList.length > 0 && (
            <Col span={4}>
              <NftRecordList />
            </Col>
          )}
        </Row>
      </Content>
    </div>
  );
};

export default Home;
