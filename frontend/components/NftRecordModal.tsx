import React, { FC, useContext, useEffect, useState } from "react";

import { Button, Modal, Space, Spin, Statisti, Typography, Descriptions } from "antd";
import { Uid } from "../utils/uid-generator";
import { css, jsx } from "@emotion/react";
import { ChainConfigContext } from "./AppStateContainer";
import { useContract, useContractRead, useProvider } from "wagmi";
import abi from "../utils/abi.json";
import { Result } from "ethers/lib/utils";
import { getMetaDataFromIpfs, NftMetadata } from "../utils/ipfs-helper";
import JsBarcode from "jsbarcode";

const { Text, Title } = Typography;

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

  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);

  const pocoNftContract = useContract({
    addressOrName: chainConfig.address,
    contractInterface: abi,
    signerOrProvider: provider,
  });

  const loadNft = async (uid: Uid) => {
    setNftMetadata(null);
    const nftUri = await pocoNftContract.getNftUriByUid(uid.toHexString());
    const metadata = await getMetaDataFromIpfs(nftUri);
    setNftMetadata(metadata);
    onFinishLoadingRecord();
    JsBarcode("#barcode", "Hi!");
  };

  useEffect(() => {
    if (uid) {
      loadNft(uid);
    }
  }, [uid]);

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
              Loading Product Digital Certificate...
            </span>
          </div>
        )}
        {uid && (
          <div>
            <div>
              <Text>Product Digital Certificate UID</Text>
            </div>
            <div>
              <Text
                css={css`
                  font-size: 16px;
                  font-weight: 600;
                `}
                copyable
              >
                {uid.formatUidForDisplay()}
              </Text>
            </div>
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
              <Descriptions.Item label="Document">{nftMetadata?.documentUri}</Descriptions.Item>
            </Descriptions>
            <Space>
              <div>
                <div>Barcode (Code 128)</div>
                <img id="barcode" />
              </div>
            </Space>
          </div>
        )}
      </Space>
    </Modal>
  );
};

export default NftRecordModal;
