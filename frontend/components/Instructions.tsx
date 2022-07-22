import React, { FC } from "react";
import { Space, Typography, Steps, Alert } from "antd";
import { css } from "@emotion/react";

const { Text, Title } = Typography;
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
          <strong>Product Digital Certificate with Universal ID (UID)</strong> which can be used to
          search for the submitted product information without requiring a wallet.
        </Text>
        <Text>
          <strong>
            The Universal ID can be shared with customers, printed on product labels as
            text/barcode/QRcode and even be stored in embedded RFID chips{" "}
          </strong>
          so that anyone can easily verify the authenticity and compliance level of the product
          using the data stored on the public blockchain.
        </Text>
        <Alert
          message={<Title level={5}>Any information submitted will be made public</Title>}
          type="warning"
          description={
            <div>
              <p>
                All product information and documents submitted through the form will be viweable on
                the public blockchain and CANNOT be removed or made private.{" "}
                <strong>Hence refrain from using any sensitive information.</strong>
              </p>
              <p>
                <strong>
                  This app is just a decentralized and open source interface and is not responsible
                  for any information submitted.
                </strong>
              </p>
            </div>
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
          description={
            <div>
              <p>Ensure you are connected to the Polygon blockchain.</p>
              <p>
                <strong>
                  For each form submission, the app charges $0.05 fee in Polygon&apos;s MATIC token.
                </strong>
              </p>
              <p>
                Ensure your wallet has enough to cover app fees ($1) and blockchain transaction fees
                (~$0.01)
              </p>
            </div>
          }
        />
        <Step
          status="process"
          title="Fill product form"
          description="Enter key information about the product that you would like to be transparent about such as ceritificate of authenticity, compliance, inspection etc."
        />
        <Step
          status="process"
          title="Get Product Digital Certificate with Universal ID (UID)"
          description="Once information is submitted, the app will generate a Digital Certificate with UID. The UID can be printed or etched on products and labels as well as be stored on RFID chips."
        />
        <Step
          status="process"
          title="Use UID to view submitted product information"
          description="A user/customer can then use the UID to view the product information with any associated certificate of authenticity, compliance, inspection etc."
        />
      </Steps>
    </div>
  );
};

export default Instructions;
