import { NftMinted as NftMintedEvent } from "../generated/PocoNft/PocoNft";
import { Nft, User } from "../generated/schema";

export function handleNftMinted(event: NftMintedEvent): void {
  const entity = new Nft(event.params.nftUid.toHexString());
  entity.minter = event.params.minter;
  entity.nftUid = event.params.nftUid;
  entity.nftUri = event.params.nftUri;

  const minterUserId = event.params.minter.toHexString();
  entity.minterUser = minterUserId;

  entity.save();

  let user = User.load(minterUserId);
  if (!user) {
    user = new User(minterUserId);
    user.save();
  }
}
