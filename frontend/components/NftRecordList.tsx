import { css } from "@emotion/react";
import { Button, List, Space, Typography } from "antd";
import * as ethers from "ethers";
import moment from "moment";
import React, { FC, useState } from "react";
import useWalletConnection from "../utils/custom-hooks";
import { Uid } from "../utils/uid-generator";
import NftRecordModal from "./NftRecordModal";

const { Text, Title, Link } = Typography;

export interface NftRecordListProps {
  logEvents: LogEvent[];
}
export interface LogEvent {
  event: ethers.Event;
  block: ethers.providers.Block;
}

const ListItem: FC<{ logEvent: LogEvent; onNftUidClick: (uid: Uid) => void }> = ({
  logEvent,
  onNftUidClick,
}) => {
  const localTime = moment.unix(logEvent.block.timestamp).local().format("MMM DD, YY - HH:mm");
  const uid = Uid.parse(logEvent.event.args.nftUid);
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

const NftRecordList: FC<NftRecordListProps> = ({ logEvents }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingNftRecord, setIsLoadingNftRecord] = useState(false);
  const [uid, setUid] = useState<Uid | null>(null);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinishLoadingNftRecord = () => {
    setIsLoadingNftRecord(false);
  };

  const handleListItemClick = (uid: Uid) => {
    setUid(uid);
    setIsLoadingNftRecord(true);
    setIsModalVisible(true);
  };

  return (
    <>
      <List
        size="large"
        header={<Title level={5}>Product Digital Certificates</Title>}
        bordered
        dataSource={logEvents}
        renderItem={(item) => (
          <ListItem
            key={item.event.transactionHash}
            logEvent={item}
            onNftUidClick={handleListItemClick}
          />
        )}
      />
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

export default NftRecordList;
