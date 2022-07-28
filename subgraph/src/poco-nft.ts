import { ipfs, json, JSONValueKind } from "@graphprotocol/graph-ts";
import { NftMinted as NftMintedEvent } from "../generated/PocoNft/PocoNft";
import { Nft, User, NftMetadata } from "../generated/schema";

export function handleNftMinted(event: NftMintedEvent): void {
  const nftUid = event.params.nftUid.toHexString();
  const nftUri = event.params.nftUri;
  const minterUserId = event.params.minter.toHexString();

  const nft = new Nft(nftUid);
  nft.minter = event.params.minter;
  nft.nftUid = event.params.nftUid;
  nft.nftUri = nftUri;

  nft.minterUser = minterUserId;
  nft.createdAtTimestamp = event.block.timestamp;
  nft.save();

  const ipfsData = ipfs.cat(nftUri.replace("ipfs://", ""));
  if (ipfsData) {
    const value = json.fromBytes(ipfsData).toObject();

    if (value) {
      const nftMetadata = new NftMetadata(nftUid);

      const organizationName = value.get("organizationName");
      if (organizationName) {
        nftMetadata.organizationName = organizationName.isNull()
          ? null
          : organizationName.toString();
      }

      const organizationBlockchainWalletAddress = value.get("organizationBlockchainWalletAddress");
      if (organizationBlockchainWalletAddress) {
        nftMetadata.organizationBlockchainWalletAddress =
          organizationBlockchainWalletAddress.isNull()
            ? null
            : organizationBlockchainWalletAddress.toString();
      }

      const organizationAddress = value.get("organizationAddress");
      if (organizationAddress) {
        nftMetadata.organizationAddress = organizationAddress.isNull()
          ? null
          : organizationAddress.toString();
      }

      const organizationWebsite = value.get("organizationWebsite");
      if (organizationWebsite) {
        nftMetadata.organizationWebsite = organizationWebsite.isNull()
          ? null
          : organizationWebsite.toString();
      }

      const productName = value.get("productName");
      if (productName) {
        nftMetadata.productName = productName.isNull() ? null : productName.toString();
      }

      const productReferenceNum = value.get("productReferenceNum");
      if (productReferenceNum) {
        nftMetadata.productReferenceNum = productReferenceNum.isNull()
          ? null
          : productReferenceNum.toString();
      }

      const productDescription = value.get("productDescription");
      if (productDescription) {
        nftMetadata.productDescription = productDescription.isNull()
          ? null
          : productDescription.toString();
      }

      const documentUri = value.get("documentUri");
      if (documentUri) {
        nftMetadata.documentUri = documentUri.isNull() ? null : documentUri.toString();
      }

      nftMetadata.nft = nft.id;
      nftMetadata.save();
    }
  }

  let user = User.load(minterUserId);
  if (!user) {
    user = new User(minterUserId);
    user.save();
  }
}
