import { css } from "@emotion/react";
import { Image } from "antd";
import { FC, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { convertFileToBase64, FILE_TYPE_PDF } from "../utils/file-helper";

interface DocumentPreviewProps {
  file: File | undefined;
}

const DocumentPreview: FC<DocumentPreviewProps> = ({ file }) => {
  const [imageUri, setImageUri] = useState<string>("");

  useEffect(() => {
    if (file && file?.type !== FILE_TYPE_PDF) {
      convertFileToBase64(file).then((uri) => setImageUri(uri as string));
    }
  }, [file]);

  return (
    <>
      {file && (
        <div
          css={css`
            border-width: 1px;
            border-color: black;
            border-style: solid;
            padding: 4px;
          `}
        >
          {file.type === FILE_TYPE_PDF ? (
            <Document
              file={file}
              noData=""
              error=""
              onLoadError={(err) => {
                console.log(err);
                if (err.name === "InvalidPDFException") {
                  console.log("Invalid PDF");
                }
              }}
            >
              <Page pageNumber={1} height={500} />
            </Document>
          ) : (
            <Image src={imageUri} alt="Document Image" width="100%" />
          )}
        </div>
      )}
    </>
  );
};

export default DocumentPreview;
