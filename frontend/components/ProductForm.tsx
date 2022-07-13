import React, { FC, useContext, useEffect, useState } from "react";
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
import { css, jsx } from "@emotion/react";
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { Document, Page, pdfjs } from "react-pdf";
import NftRecordModal from "./NftRecordModal";
import { NftMetadata, uploadFileToIpfs, uploadMetaDataToIpfs } from "../utils/ipfs-helper";
import { Uid } from "../utils/uid-generator";
import { getAppFeesInMatic } from "../utils/app-fees-helper";
import { openNotificationWithIcon } from "../utils/notification-helper";
import { useAccount, useContract, useContractWrite, useNetwork, useProvider } from "wagmi";
import { ChainConfigContext } from "./AppStateContainer";
import abi from "../utils/abi.json";
import useWalletConnection from "../utils/custom-hooks";
import { ethers } from "ethers";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ProductForm: FC = () => {
  const [numPages, setNumPages] = useState(0);
  const [file, setFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingNftRecord, setIsLoadingNftRecord] = useState(false);
  const [uid, setUid] = useState<Uid | null>(null);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const chainConfig = useContext(ChainConfigContext);

  const isWalletConnected = useWalletConnection();

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

  const pocoNftContract = useContract({
    addressOrName: chainConfig?.address,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinishLoadingNftRecord = () => {
    setIsLoadingNftRecord(false);
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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

      console.log("uid", uid.toDisplayFormat());

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
        setIsModalVisible(true);
        setIsLoadingNftRecord(true);
        setUid(Uid.parse(event.args.nftUid));
      }
    });
  };

  return (
    <>
      <Form
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name="form"
        onFinish={handleFormSubmit}
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <Form.Item
          name="organizationName"
          label="Organization Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="organizationWebsite" label="Orgnization Website">
          <Input />
        </Form.Item>
        <Form.Item name="organizationAddress" label="Orgnization Address">
          <Input />
        </Form.Item>
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="productReferenceNum"
          label="Product Reference #"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="productDescription" label="Product Description">
          <TextArea />
        </Form.Item>
        <Form.Item
          name="fileToUpload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            maxCount={1}
            onRemove={() => setFile(undefined)}
            beforeUpload={async (file) => {
              async function setFileAsync() {
                setFile(await toBase64(file));
              }
              setFileAsync();
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Document
          file={file}
          onLoadSuccess={(numPages) => {
            console.log("numpages", numPages);
            setNumPages(numPages._pdfInfo.numPages);
          }}
        >
          <Page pageNumber={1} />
          <Button>Prev</Button>
          <span>2</span>
          <Button>Next</Button>
        </Document>
        <Form.Item>
          <Button type="primary" size="large" htmlType="submit" disabled={!isWalletConnected}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <NftRecordModal
        uid={uid!}
        isModalVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        isLoadingRecord={isLoadingNftRecord}
        onFinishLoadingRecord={handleFinishLoadingNftRecord}
      />
    </>
  );
};

export default ProductForm;
