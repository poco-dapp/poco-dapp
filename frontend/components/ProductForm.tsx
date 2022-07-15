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
import { useNftRecordModal, useWalletConnection } from "../utils/custom-hooks";
import { ethers } from "ethers";
import { showErrorNotification } from "../utils/error-helper";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Text } = Typography;

const ProductForm: FC = () => {
  const [numPages, setNumPages] = useState(0);
  const [file, setFile] = useState(null);
  const { chain } = useNetwork();
  const provider = useProvider();
  const chainConfig = useContext(ChainConfigContext);
  const { address: walletAddress } = useAccount();
  const {
    uid,
    isModalVisible,
    isLoadingNftRecord,
    handleOk,
    handleCancel,
    handleFinishLoadingNftRecord,
    launchModalWithUid,
    dismissModal,
    launchModalForProgress,
  } = useNftRecordModal();
  const [form] = Form.useForm();

  const isWalletConnected = useWalletConnection();

  const contractWrite = useContractWrite({
    addressOrName: chainConfig?.address,
    contractInterface: abi,
    functionName: "mintNft",
    onSuccess(data) {
      handleMintSuccess(data);
    },
  });

  const pocoNftContract = useContract({
    addressOrName: chainConfig?.address,
    contractInterface: abi,
    signerOrProvider: provider,
  });

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
    launchModalForProgress();

    try {
      const documentUri = values.fileToUpload
        ? await uploadFileToIpfs(values.fileToUpload[0].originFileObj)
        : null;

      const uid = Uid.generateUid();

      const metadata: NftMetadata = {
        uid: uid.toString(),
        organizationName: values.organizationName,
        organizationBlockchainWalletAddress: walletAddress as string,
        organizationWebsite: values.organizationWebsite || null,
        organizationAddress: values.organizationAddress || null,
        productName: values.productName,
        productReferenceNum: values.productReferenceNum,
        productDescription: values.productDescription || null,
        documentUri: documentUri,
      };
      const metadataUri = await uploadMetaDataToIpfs(metadata);

      const appFeesInMatic = await getAppFeesInMatic(chain?.id);

      await contractWrite.writeAsync({
        args: [uid.toHexString(), metadataUri],
        overrides: { value: ethers.utils.parseEther(String(appFeesInMatic)) },
      });
    } catch (err) {
      showErrorNotification("Form Submission Error", err as Error);
      dismissModal();
    }
  };

  const handleMintSuccess = async (tx: ethers.providers.TransactionResponse) => {
    await tx.wait(chainConfig.blockConfirmations);

    const nftMintedEventFilter = pocoNftContract.filters.NftMinted(walletAddress);

    const events = await pocoNftContract.queryFilter(nftMintedEventFilter, "latest");

    events.forEach((event) => {
      if (event.transactionHash === tx.hash) {
        launchModalWithUid(Uid.parse(event.args.nftUid));
      }
    });

    form.resetFields();
  };

  return (
    <>
      <Form
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name="form"
        onFinish={handleFormSubmit}
        form={form}
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
          label={
            <Space direction="vertical">
              <Text>Upload Product Document</Text>
              <Text type="secondary">
                (Certificate of Authenticity / Compliance / Inspection, etc.)
              </Text>
            </Space>
          }
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
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            disabled={!isWalletConnected}
            css={css`
              width: 100%;
            `}
          >
            Submit Product Form
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
