import React, { FC, useContext, useState } from "react";
import { Button, Input, Space, Form, Upload, Typography } from "antd";
import { css } from "@emotion/react";
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { Document, Page, pdfjs } from "react-pdf";
import { useAccount, useContract, useContractWrite, useNetwork, useProvider } from "wagmi";
import { ethers } from "ethers";
import NftRecordModal from "./NftRecordModal";
import { ChainConfigContext } from "./AppStateContainer";
import DocumentPreview from "./DocumentPreview";
import { NftMetadata, uploadFileToIpfs, uploadMetaDataToIpfs } from "../utils/ipfs-helper";
import { Uid } from "../utils/uid-generator";
import { getAppFeesInMatic } from "../utils/app-fees-helper";
import abi from "../utils/abi.json";
import { useNftRecordModal, useWalletConnection } from "../utils/custom-hooks";
import { showErrorNotification } from "../utils/error-helper";
import { convertFileToBase64, isValidFile } from "../utils/file-helper";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Text } = Typography;

const ProductForm: FC = () => {
  const [previewFile, setPreviewFile] = useState<File | undefined>();
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

  const handleFileBeforeUpload = (file: File) => {
    if (isValidFile(file)) {
      //(async () => setFile(await convertFileToBase64(file)))();
      setPreviewFile(file);
    }

    return false;
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
              <Text type="secondary">Only PNG, JPG, PDF allowed and must be less than 5MB.</Text>
            </Space>
          }
        >
          <Upload
            maxCount={1}
            onRemove={() => {
              setPreviewFile(undefined);
            }}
            beforeUpload={handleFileBeforeUpload}
            css={css`
              & .ant-upload {
                width: 100%;
              }
            `}
          >
            <Button
              type="dashed"
              icon={<UploadOutlined />}
              css={css`
                width: 100%;
              `}
            >
              Select File
            </Button>
          </Upload>
        </Form.Item>
        <DocumentPreview file={previewFile} />
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            disabled={!isWalletConnected}
            css={css`
              width: 100%;
              margin-top: 8px;
            `}
          >
            Submit Product Form
          </Button>
        </Form.Item>
      </Form>
      <NftRecordModal
        uid={uid}
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
