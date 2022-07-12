import React, { FC, useState } from "react";
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
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ProductFormProps {
  onFormSubmit: (values: any) => void;
  isWalletConnected: boolean;
}

const ProductForm: FC<ProductFormProps> = ({ onFormSubmit, isWalletConnected }) => {
  const [numPages, setNumPages] = useState(0);
  const [file, setFile] = useState(null);

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Form
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      name="form"
      onFinish={onFormSubmit}
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <Form.Item
        name="organizationName"
        label="Organization Name"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="organizationWebsite" label="Orgnization Website">
        <Input />
      </Form.Item>
      <Form.Item name="organizationAddress" label="Orgnization Address">
        <Input />
      </Form.Item>
      <Form.Item
        name="productName"
        label="Product Name"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="productReferenceNum"
        label="Product Reference #"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="productDescription" label="Product Description">
        <TextArea />
      </Form.Item>
      <Form.Item
        name="fileToUpload"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          maxCount={1}
          onRemove={() => setFile(undefined)}
          beforeUpload={async (file) => {
            async function setFileAsync() {
              setFile(await toBase64(file));
            }
            setFileAsync();
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Form.Item>
      <Document
        file={file}
        onLoadSuccess={(numPages) => {
          console.log("numpages", numPages);
          setNumPages(numPages._pdfInfo.numPages);
        }}
      >
        <Page pageNumber={1} />
        <Button>Prev</Button>
        <span>2</span>
        <Button>Next</Button>
      </Document>
      <Form.Item>
        <Button type="primary" size="large" htmlType="submit" disabled={!isWalletConnected}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
