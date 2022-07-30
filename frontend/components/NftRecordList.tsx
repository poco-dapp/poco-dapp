import { css } from "@emotion/react";
import { Button, List, Space, Typography } from "antd";
import * as ethers from "ethers";
import moment from "moment";
import React, { FC } from "react";
import NftRecordModal from "./NftRecordModal";
import { useNftRecordModal } from "../utils/custom-hooks";
import { Uid } from "../utils/uid-generator";
import { GetNftsByUserIdQuery, Nft } from "../graphql/generated";

const { Text, Title } = Typography;

export interface NftRecordListProps {
  loading: boolean;
  graphNftDataList: NonNullable<GetNftsByUserIdQuery["user"]>["nftsMinted"] | undefined;
}

export interface LogEvent {
  event: ethers.Event;
  block: ethers.providers.Block;
}

const ListItem: FC<{ nft: any; onNftUidClick: (uid: Uid) => void }> = ({ nft, onNftUidClick }) => {
  const localTime = moment.unix(nft.createdAtTimestamp).local().format("MMM DD, YY - hh:mm A");

  const uid = Uid.parse(nft.id);
  const uidForDisplay = uid.toDisplayFormat();

  return (
    <List.Item>
      <Space direction="vertical" size={1}>
        <div>
          <Text type="secondary">{localTime}</Text>
        </div>
        <Button
          type="link"
          onClick={() => onNftUidClick(uid)}
          css={css`
            padding: 0;
          `}
        >
          {uidForDisplay}
        </Button>
      </Space>
    </List.Item>
  );
};

const NftRecordList: FC<NftRecordListProps> = ({ graphNftDataList, loading }) => {
  const {
    uid,
    isModalVisible,
    isLoadingNftRecord,
    handleOk,
    handleCancel,
    handleFinishLoadingNftRecord,
    launchModalWithUid,
  } = useNftRecordModal();

  const handleNftUidClick = (uid: Uid) => {
    launchModalWithUid(uid);
  };

  return (
    <>
      <List
        size="large"
        header={<Title level={5}>Product Digital Certificates</Title>}
        bordered
        dataSource={graphNftDataList}
        loading={loading}
        renderItem={(item) => (
          <ListItem key={item.id} nft={item} onNftUidClick={handleNftUidClick} />
        )}
      />
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

export default NftRecordList;
