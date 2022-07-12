import { create } from "ipfs-http-client";
import toBuffer = require("it-to-buffer");
import { toString } from "uint8arrays/to-string";

const IPFS_URI_PREFIX = "ipfs://";

export interface NftMetadata {
  uid: string;
  organizationName: string;
  organizationAddress: string | null;
  organizationWebsite: string | null;
  productName: string;
  productReferenceNum: string;
  productDescription: string | null;
  documentUri: string | null;
}

// TODO: Find another public gateway as Infura gateway is being deprecated
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export async function uploadMetaDataToIpfs(metadata: NftMetadata): Promise<string> {
  const results = await client.add(JSON.stringify(metadata));
  return `${IPFS_URI_PREFIX}${results.cid.toV1().toString()}`;
}

export async function uploadFileToIpfs(file: File): Promise<string> {
  const results = await client.add(file);
  return `${IPFS_URI_PREFIX}${results.cid.toV1().toString()}`;
}

export async function getMetaDataFromIpfs(ipfsCid: string): Promise<NftMetadata> {
  const normalizedCid = ipfsCid.replace("ipfs://", "");
  const uint8arr = await toBuffer(client.cat(normalizedCid));
  const result = JSON.parse(toString(uint8arr));
  return result;
}
