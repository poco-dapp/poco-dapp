import React, { FC, useContext, useState } from "react";
import { Button, Input, Space, Form, Upload, Typography, message } from "antd";
import { css } from "@emotion/react";
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { pdfjs } from "react-pdf";
import { useAccount, useContract, useContractWrite, useNetwork, useProvider } from "wagmi";
import { ContractInterface, ethers } from "ethers";
import NftRecordModal from "./NftRecordModal";
import { ChainConfigContext } from "./AppStateContainer";
import DocumentPreview from "./DocumentPreview";
import { NftMetadata, uploadFileToIpfs, uploadMetaDataToIpfs } from "../utils/ipfs-helper";
import { Uid } from "../utils/uid-generator";
import { getAppFeesInMatic } from "../utils/app-fees-helper";
import abi from "../utils/abi.json";
import { useNftRecordModal, useWalletConnection } from "../utils/custom-hooks";
import { showErrorNotification } from "../utils/error-helper";
import { isValidFile } from "../utils/file-helper";

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
    addressOrName: chainConfig?.contractAddress,
    contractInterface: abi as ContractInterface,
    functionName: "mintNft",
    onSuccess(data) {
      handleMintSuccess(data);
    },
  });

  const pocoNftContract = useContract({
    addressOrName: chainConfig?.contractAddress,
    contractInterface: abi as ContractInterface,
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

      if (chain) {
        const appFeesInMatic = await getAppFeesInMatic(chain.id);

        await contractWrite.writeAsync({
          args: [uid.toHexString(), metadataUri],
          overrides: {
            value: ethers.utils.parseEther(String(appFeesInMatic)),
            gasLimit: 3785823,
          },
        });
      }
    } catch (err) {
      showErrorNotification("Form Submission Error", err as Error);
      dismissModal();
    }
  };

  const handleMintSuccess = async (tx: ethers.providers.TransactionResponse) => {
    const txReceipt = await tx.wait(chainConfig.blockConfirmations);

    const nftMintedEventFilter = pocoNftContract.filters.NftMinted(walletAddress);

    const events = await pocoNftContract.queryFilter(
      nftMintedEventFilter,
      txReceipt.blockNumber - chainConfig.blockConfirmations,
      txReceipt.blockNumber
    );

    events.forEach((event: ethers.Event) => {
      if (event.transactionHash === tx.hash && event.args) {
        launchModalWithUid(Uid.parse(event.args.nftUid));
      }
    });

    form.resetFields();
    setPreviewFile(undefined);
  };

  const handleFileBeforeUpload = (file: File) => {
    if (isValidFile(file)) {
      setPreviewFile(file);
    } else {
      message.error("Invalid File. Only JPG, PNG and PDF types allowed and must be less than 5MB.");
      setPreviewFile(undefined);
    }

    return false;
  };

  const normFile = (e: { file: File; fileList: File[] }) => {
    if (Array.isArray(e)) {
      return e;
    }

    if (!isValidFile(e.fileList[0])) {
      return [];
    }

    return e.fileList;
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
          valuePropName="fileList"
          getValueFromEvent={normFile}
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
              margin-top: 24px;
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
