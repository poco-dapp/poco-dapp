import React, { FC, useContext, useEffect, useRef, useState } from "react";

import { Button, Modal, Space, Spin, Typography, Descriptions, Divider } from "antd";
import { css } from "@emotion/react";
import { useContract, useProvider } from "wagmi";
import JsBarcode from "jsbarcode";
import { QRCodeCanvas } from "qrcode.react";
import { ContractInterface } from "ethers";
import { ChainConfigContext } from "./AppStateContainer";
import { downloadFileFromIpfs } from "../utils/ipfs-helper";
import abi from "../utils/abi.json";
import { Uid } from "../utils/uid-generator";
import { downloadFileUsingDataUri } from "../utils/download-helper";
import { showErrorNotification } from "../utils/error-helper";
import { getNftByIdWithRetry } from "../utils/graph-api";
import { GetNftByIdQuery } from "../graphql/generated";

const { Text } = Typography;

interface NftRecordModalProps {
  isModalVisible: boolean;
  uid: Uid | null;
  isLoadingRecord: boolean;
  onFinishLoadingRecord: () => void;
  onOk: () => void;
  onCancel: () => void;
}

const NftRecordModal: FC<NftRecordModalProps> = ({
  isModalVisible,
  uid,
  onOk,
  onCancel,
  isLoadingRecord,
  onFinishLoadingRecord,
}) => {
  const chainConfig = useContext(ChainConfigContext);
  const provider = useProvider();
  const barcodeImgRef = useRef<HTMLImageElement | null>(null);
  const [nftData, setNftData] = useState<GetNftByIdQuery["nft"]>(null);
  const [downloadDocumentInProgress, setDownloadDocumentInProgress] = useState(false);

  const pocoNftContract = useContract({
    addressOrName: chainConfig.contractAddress,
    contractInterface: abi as ContractInterface,
    signerOrProvider: provider,
  });

  useEffect(() => {
    if (uid) {
      loadNft(uid);
    }
  }, [uid]);

  const loadNft = async (uid: Uid) => {
    try {
      await checkIfNftExists(uid);
      setNftData(await getNftByIdWithRetry(uid));
      onFinishLoadingRecord();
      JsBarcode("#barcode", uid.toDisplayFormat(), {
        format: "CODE128",
        width: 1,
      });
    } catch (err) {
      showErrorNotification("Search Error", err as Error);
      onFinishLoadingRecord();
      onCancel();
    }
  };

  const checkIfNftExists = async (uid: Uid) => {
    await pocoNftContract.getNftUriByUid(uid.toHexString()); // check if nft exists
  };

  const handleDownloadQRCode = () => {
    const canvas: HTMLCanvasElement | null = document.querySelector(".qrCode > canvas");
    if (canvas) {
      downloadFileUsingDataUri(canvas.toDataURL(), `qrcode_${uid?.toDisplayFormat()}.png`);
    }
  };

  const handleDownloadDocument = async () => {
    setDownloadDocumentInProgress(true);
    if (nftData?.metadata?.documentUri && uid) {
      await downloadFileFromIpfs(nftData.metadata.documentUri, `document_${uid.toDisplayFormat()}`);
    }
    setDownloadDocumentInProgress(false);
  };

  return (
    <Modal
      visible={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button onClick={onOk} key="submit" type="primary">
          OK
        </Button>,
      ]}
    >
      <Space direction="vertical">
        {isLoadingRecord && (
          <div>
            <Spin size="large" />
            <span
              css={css`
                margin-left: 16px;
              `}
            >
              Processing Product Digital Certificate...
            </span>
          </div>
        )}
        {uid && (
          <div>
            <div>
              <Text
                css={css`
                  font-size: 16px;
                  color: gray;
                `}
              >
                Product Digital Certificate UID
              </Text>
            </div>
            <div>
              <Text
                css={css`
                  font-size: 18px;
                  font-weight: 600;
                `}
                copyable
              >
                {uid.toDisplayFormat()}
              </Text>
            </div>
            <Divider />
            <Descriptions
              css={css`
                margin-top: 16px;
              `}
              bordered
              column={1}
              labelStyle={{
                width: "24%",
              }}
            >
              <Descriptions.Item label="Orgnaization Name">
                {nftData?.metadata?.organizationName}
              </Descriptions.Item>
              <Descriptions.Item label="Orgnaization Blockchain Wallet">
                <a
                  href={`${chainConfig.blockExplorerUrl}/address/${nftData?.metadata?.organizationBlockchainWalletAddress}`}
                >
                  {nftData?.metadata?.organizationBlockchainWalletAddress}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Orgnaization Address">
                {nftData?.metadata?.organizationAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Orgnaization Website">
                {nftData?.metadata?.organizationWebsite}
              </Descriptions.Item>
              <Descriptions.Item label="Product Name">
                {nftData?.metadata?.productName}
              </Descriptions.Item>
              <Descriptions.Item label="Product Reference #">
                {nftData?.metadata?.productReferenceNum}
              </Descriptions.Item>
              <Descriptions.Item label="Product Description">
                {nftData?.metadata?.productDescription}
              </Descriptions.Item>
              <Descriptions.Item label="Document">
                {nftData?.metadata?.documentUri && (
                  <Button
                    type="primary"
                    onClick={handleDownloadDocument}
                    loading={downloadDocumentInProgress}
                  >
                    Download Document
                  </Button>
                )}
              </Descriptions.Item>
            </Descriptions>
            <Space
              direction="vertical"
              size={24}
              css={css`
                margin-top: 16px;
                font-size: 16px;
              `}
            >
              <div>
                <a
                  href={barcodeImgRef?.current?.src}
                  download={`barcode_${uid.toDisplayFormat()}.png`}
                >
                  Download Barcode (CODE128)
                </a>
                <img alt="barcode" id="barcode" ref={barcodeImgRef} />
              </div>
              <div>
                <div>
                  <Button
                    type="link"
                    onClick={handleDownloadQRCode}
                    css={css`
                      padding: 0;
                      font-size: 16px;
                    `}
                  >
                    Download QRCode
                  </Button>
                </div>
                <div className="qrCode">
                  <QRCodeCanvas value={uid.toDisplayFormat()} />,
                </div>
              </div>
            </Space>
          </div>
        )}
      </Space>
    </Modal>
  );
};

export default NftRecordModal;
