import { CID, create } from "ipfs-http-client";
import { toString } from "uint8arrays/to-string";
import filetypemime from "magic-bytes.js";
import { downloadFileUsingBytes } from "./download-helper";
import { isLocalEnv } from "./constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toBuffer = require("it-to-buffer");

const IPFS_URI_PREFIX = "ipfs://";

const IPFS_PUBLIC_HTPP_GATEWAY = "ipfs.dweb.link";

export interface NftMetadata {
  uid: string;
  organizationName: string;
  organizationBlockchainWalletAddress: string;
  organizationAddress: string | null;
  organizationWebsite: string | null;
  productName: string;
  productReferenceNum: string;
  productDescription: string | null;
  documentUri: string | null;
}

const client = create({
  url: isLocalEnv ? "http://localhost:5001" : "https://api.thegraph.com/ipfs/api/v0/",
});

export async function uploadMetaDataToIpfs(metadata: NftMetadata): Promise<string> {
  const results = await client.add(JSON.stringify(metadata));
  return pinCid(results.cid);
}

export async function uploadFileToIpfs(file: File): Promise<string> {
  const results = await client.add(file);
  return pinCid(results.cid);
}

export async function getMetaDataFromIpfs(ipfsCid: string): Promise<NftMetadata> {
  const file = await getFileFromIpfs(ipfsCid);
  const result = JSON.parse(toString(file));
  return result;
}

export function generateIpfsHttpLink(ipfsCid: string): string {
  return `${ipfsCid}.${IPFS_PUBLIC_HTPP_GATEWAY}`;
}

export async function downloadFileFromIpfs(ipfsCid: string, name: string): Promise<void> {
  const uint8array = await getFileFromIpfs(ipfsCid);
  const mimeFileTypeObj = filetypemime(uint8array)[0];
  const fileExtension = mimeFileTypeObj.extension;

  if (mimeFileTypeObj.mime) {
    downloadFileUsingBytes(uint8array, mimeFileTypeObj.mime, `${name}.${fileExtension}`);
  }
}

async function getFileFromIpfs(ipfsCid: string): Promise<Uint8Array> {
  const normalizedCid = ipfsCid.replace("ipfs://", "");
  return toBuffer(client.cat(normalizedCid));
}

async function pinCid(cid: CID): Promise<string> {
  const pinnedCid = await client.pin.add(cid);
  return `${IPFS_URI_PREFIX}${pinnedCid.toV1().toString()}`;
}
