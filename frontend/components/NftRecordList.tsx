import { List } from "antd";
import React, { FC } from "react";

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

const NftRecordList: FC = () => {
  return (
    <List
      size="large"
      header="Past Submissions"
      bordered
      dataSource={data}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  );
};

export default NftRecordList;
