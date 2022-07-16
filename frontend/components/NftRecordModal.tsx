import React, { FC, useContext, useEffect, useRef, useState } from "react";

import { Button, Modal, Space, Spin, Typography, Descriptions, Divider } from "antd";
import { css } from "@emotion/react";
import { useContract, useNetwork, useProvider } from "wagmi";
import JsBarcode from "jsbarcode";
import { QRCodeCanvas } from "qrcode.react";
import { ChainConfigContext } from "./AppStateContainer";
import { downloadFileFromIpfs, getMetaDataFromIpfs, NftMetadata } from "../utils/ipfs-helper";
import abi from "../utils/abi.json";
import { Uid } from "../utils/uid-generator";
import { downloadFileUsingDataUri } from "../utils/download-helper";
import { showErrorNotification } from "../utils/error-helper";

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
  const { chain } = useNetwork();
  const barcodeImgRef = useRef<HTMLImageElement | null>(null);
  const qrcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
  const [downloadDocumentInProgress, setDownloadDocumentInProgress] = useState(false);

  const pocoNftContract = useContract({
    addressOrName: chainConfig.address,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  useEffect(() => {
    if (uid) {
      loadNft(uid);
    }
  }, [uid]);

  const loadNft = async (uid: Uid) => {
    try {
      if (!chain) {
        throw new Error("Unable to connect to the blockchain.");
      }
      setNftMetadata(null);
      const nftUri = await pocoNftContract.getNftUriByUid(uid.toHexString());
      const metadata = await getMetaDataFromIpfs(nftUri);
      setNftMetadata(metadata);
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

  const handleDownloadQRCode = () => {
    const canvas: HTMLCanvasElement | null = document.querySelector(".qrCode > canvas");
    if (canvas) {
      downloadFileUsingDataUri(canvas.toDataURL(), `qrcode_${uid?.toDisplayFormat()}.png`);
    }
  };

  const handleDownloadDocument = async () => {
    setDownloadDocumentInProgress(true);
    if (nftMetadata?.documentUri && uid) {
      await downloadFileFromIpfs(nftMetadata.documentUri, `document_${uid.toDisplayFormat()}`);
    }
    setDownloadDocumentInProgress(false);
  };

  return (
    <Modal
      visible={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
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
                width: "50%",
              }}
            >
              <Descriptions.Item label="Orgnaization Name">
                {nftMetadata?.organizationName}
              </Descriptions.Item>
              <Descriptions.Item label="Orgnaization Blockchain Wallet">
                {nftMetadata?.organizationBlockchainWalletAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Orgnaization Address">
                {nftMetadata?.organizationAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Orgnaization Website">
                {nftMetadata?.organizationWebsite}
              </Descriptions.Item>
              <Descriptions.Item label="Product Name">{nftMetadata?.productName}</Descriptions.Item>
              <Descriptions.Item label="Product Reference #">
                {nftMetadata?.productReferenceNum}
              </Descriptions.Item>
              <Descriptions.Item label="Product Description">
                {nftMetadata?.productDescription}
              </Descriptions.Item>
              <Descriptions.Item label="Document">
                {nftMetadata?.documentUri && (
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
                <div className="qrCode" ref={qrcodeCanvasRef}>
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
