import { css } from "@emotion/react";
import { Button, List, Space, Typography } from "antd";
import * as ethers from "ethers";
import moment from "moment";
import React, { FC } from "react";
import NftRecordModal from "./NftRecordModal";
import { useNftRecordModal } from "../utils/custom-hooks";
import { Uid } from "../utils/uid-generator";

const { Text, Title } = Typography;

export interface NftRecordListProps {
  logEvents: LogEvent[];
  loading: boolean;
}
export interface LogEvent {
  event: ethers.Event;
  block: ethers.providers.Block;
}

const ListItem: FC<{ logEvent: LogEvent; onNftUidClick: (uid: Uid) => void }> = ({
  logEvent,
  onNftUidClick,
}) => {
  const localTime = moment.unix(logEvent.block.timestamp).local().format("MMM DD, YY - hh:mm A");

  let uidForDisplay;
  let uid: Uid;
  if (logEvent.event.args) {
    uid = Uid.parse(logEvent.event.args.nftUid);
    uidForDisplay = uid.toDisplayFormat();
  }

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

const NftRecordList: FC<NftRecordListProps> = ({ logEvents, loading }) => {
  const {
    uid,
    isModalVisible,
    isLoadingNftRecord,
    handleOk,
    handleCancel,
    handleFinishLoadingNftRecord,
    launchModalWithUid,
  } = useNftRecordModal();

  const handleListItemClick = (uid: Uid) => {
    launchModalWithUid(uid);
  };

  return (
    <>
      <List
        size="large"
        header={<Title level={5}>Product Digital Certificates</Title>}
        bordered
        dataSource={logEvents}
        loading={loading}
        renderItem={(item) => (
          <ListItem
            key={item.event.transactionHash}
            logEvent={item}
            onNftUidClick={handleListItemClick}
          />
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
