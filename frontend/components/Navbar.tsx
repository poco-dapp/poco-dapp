import React, { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { css } from "@emotion/react";
import { message, Tag, Typography } from "antd";
import Search from "antd/lib/input/Search";
import { Header } from "antd/lib/layout/layout";
import NftRecordModal from "./NftRecordModal";
import { Uid } from "../utils/uid-generator";
import { PRIMARY_COLOR } from "../utils/constants";
import { useNftRecordModal } from "../utils/custom-hooks";

const { Title } = Typography;

const Navbar: FC = () => {
  const {
    uid,
    isModalVisible,
    isLoadingNftRecord,
    handleOk,
    handleCancel,
    handleFinishLoadingNftRecord,
    launchModalWithUid,
  } = useNftRecordModal();

  const handleSearch = (searchTerm: string) => {
    if (!Uid.isValid(searchTerm)) {
      message.error("Invalid UID for search");
      return;
    }
    launchModalWithUid(Uid.parse(searchTerm));
  };

  return (
    <Header
      css={css`
        background: white;
        display: flex;
        padding: 16px;
        justify-content: space-between;
      `}
    >
      <Title
        css={css`
          &.ant-typography {
            color: ${PRIMARY_COLOR};
          }
        `}
        level={2}
      >
        POCO://{" "}
        <span>
          <Tag color="orange">test mode</Tag>
        </span>
      </Title>
      <Search
        placeholder="Product's digital certificate UID, eg. 01-5848ACB-7CBC-4ABA-B6AC-DD755DB0593F"
        allowClear
        enterButton="Search"
        size="large"
        style={{ width: 600 }}
        onSearch={handleSearch}
        css={css`
          &.ant-input-group-wrapper-lg .ant-input-group .ant-input-affix-wrapper-lg {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          &.ant-input-group-wrapper-lg .ant-btn.ant-btn-primary.ant-btn-lg.ant-input-search-button {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        `}
      />
      <ConnectButton />
      <NftRecordModal
        uid={uid}
        isModalVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        isLoadingRecord={isLoadingNftRecord}
        onFinishLoadingRecord={handleFinishLoadingNftRecord}
      />
    </Header>
  );
};

export default Navbar;
