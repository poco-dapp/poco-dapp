import React, { FC } from "react";
import {
  Button,
  Col,
  Menu,
  MenuProps,
  Row,
  Input,
  Space,
  Form,
  InputNumber,
  Upload,
  UploadFile,
  Typography,
  Steps,
  List,
  Alert,
  Tag,
} from "antd";
import { css, jsx } from "@emotion/react";

const { Text } = Typography;
const { Step } = Steps;

const Instructions: FC = () => {
  return (
    <div>
      <Space
        direction="vertical"
        css={css`
          font-size: 16px;
        `}
      >
        <Text>
          POCO is a <strong>decentralized app</strong> to store{" "}
          <strong>Proof of Certification and Ownership information</strong> for{" "}
          <strong>physical products</strong> to combat counterfeiting and facilitate traceability.
        </Text>
        <Text>
          Since the app uses a{" "}
          <strong>
            public blockchain and filesystem - <a href="https://polygonscan.com/">Polygon</a> and{" "}
            <a href="https://ipfs.io/">IPFS</a>
          </strong>
          , all product information and documents submitted will always be available without
          restriction.
        </Text>
        <Text>
          The app will generate a{" "}
          <strong>Product Digital Certificate with Universal ID (UID)</strong> that can be used to
          search for the submitted product information.
        </Text>
        <Alert
          message="Any information submitted will be made public"
          type="warning"
          description={
            <p>
              All product information and documents submitted through the form will be viweable on
              the public blockchain. Refrain from using any sensitive information.
              <br />
              This app is just an interface and is not responsible for any information submitted.
            </p>
          }
          showIcon
        />
      </Space>

      <Steps
        direction="vertical"
        current={1}
        css={css`
          &.ant-steps-vertical .ant-steps-item-content {
            min-height: 120px;
          }
          margin-top: 16px;
        `}
      >
        <Step
          status="process"
          title="Connect your wallet"
          description="Ensure you are connected to the Polygon blockchain."
        />
        <Step
          status="process"
          title="Fill product form"
          description="Enter key information about the product that you would like to be transparent about such as ceritificate of ownership, authenticity, compliance etc."
        />
        <Step
          status="process"
          title="Get Product Digital Certificate with Universal ID (UID)"
          description="Once information is submitted, the app will generate a Digital Certificate with UID. The UID can be printed or etched on products and labels as well as be stored on RFID chips."
        />
        <Step
          status="process"
          title="Use UID to view submitted product information"
          description="A user/customer can then use the UID to view the product information with any associated certificate of ownership, authenticity, compliance etc."
        />
      </Steps>
    </div>
  );
};

export default Instructions;
