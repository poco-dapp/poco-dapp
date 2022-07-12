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

const { Title } = Typography;
const { Search } = Input;

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const chainConfig = useContext(ChainConfigContext);

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [nftRecordList, setNftRecordList] = useState([]);

  const contractWrite = useContractWrite({
    addressOrName: chainConfig?.address,
    contractInterface: abi,
    functionName: "mintNft",
    onError(error) {
      openNotificationWithIcon("error", "Contract Update Error", error.reason || error.message);
    },
    onSuccess(data) {
      handleMintSuccess(data);
    },
  });

  const pocoNftContract: Contract = useContract({
    addressOrName: chainConfig?.address,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  useEffect(() => {
    if (isConnected) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [isConnected]);

  const handleFormSubmit = async (values: any) => {
    try {
      const documentUri = values.fileToUpload
        ? await uploadFileToIpfs(values.fileToUpload[0].originFileObj)
        : null;

      const uid = Uid.generateUid();

      const metadata: NftMetadata = {
        uid: uid.toString(),
        organizationName: values.organizationName,
        organizationWebsite: values.organizationWebsite || null,
        organizationAddress: values.organizationAddress || null,
        productName: values.productName,
        productReferenceNum: values.productReferenceNum,
        productDescription: values.productDescription || null,
        documentUri: documentUri,
      };
      const metadataUri = await uploadMetaDataToIpfs(metadata);

      const appFeesInMatic = await getAppFeesInMatic(chain?.id);

      console.log("uid", uid.formatUidForDisplay());

      contractWrite.writeAsync({
        args: [uid.toHexString(), metadataUri],
        overrides: { value: ethers.utils.parseEther(String(appFeesInMatic)) },
      });
      // show modal with spinner
    } catch (e: any) {
      openNotificationWithIcon("error", "Form Submission Error", e.message);
    }
  };

  const handleMintSuccess = async (tx: ethers.providers.TransactionResponse) => {
    await tx.wait(chainConfig.blockConfirmations);
    console.log("mintSuccess");

    const nftMintedEventFilter = pocoNftContract.filters.NftMinted();

    const events = await pocoNftContract.queryFilter(nftMintedEventFilter, "latest");

    events.forEach((event) => {
      if (event.transactionHash === tx.hash) {
        console.log("event", event.args.nftUid, event.args.nftUri);
        // update modal
      }
    });
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
              <ProductForm onFormSubmit={handleFormSubmit} isWalletConnected={isWalletConnected} />
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
