import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";
import { SUBGRAPH_API_URL } from "./constants";
import { sleep } from "./misc";
import { Uid } from "./uid-generator";

const graphQLClient = new GraphQLClient(SUBGRAPH_API_URL, {});

const NFT_FRAGMENT = gql`
  fragment NftFields on Nft {
    id
    createdAtTimestamp
    metadata {
      organizationName
      organizationBlockchainWalletAddress
      organizationAddress
      organizationWebsite
      productName
      productReferenceNum
      productDescription
      documentUri
    }
  }
`;

const GET_NFTS_BY_USER_ID = gql`
  query getNftsByUserId($userId: ID!) {
    user(id: $userId) {
      nftsMinted(orderBy: createdAtTimestamp, orderDirection: desc) {
        ...NftFields
      }
    }
  }
  ${NFT_FRAGMENT}
`;

const GET_NFT_BY_ID = gql`
  query getNftById($nftId: ID!) {
    nft(id: $nftId) {
      ...NftFields
    }
  }
  ${NFT_FRAGMENT}
`;

export const useGetNftsByUserId = (userId: string | undefined) => {
  const normalizedUserId = userId && userId.toLowerCase();

  return useQuery(["getNftsByUserId", normalizedUserId], async () => {
    if (!normalizedUserId) {
      return [];
    }
    const { user } = await graphQLClient.request(GET_NFTS_BY_USER_ID, {
      userId: normalizedUserId,
    });
    return user ? user.nftsMinted : [];
  });
};

export const getNftById = async (uid: Uid | null) => {
  if (!uid) {
    return null;
  }

  const { nft } = await graphQLClient.request(GET_NFT_BY_ID, {
    nftId: uid.toHexString(),
  });

  return nft;
};

export const getNftByIdWithRetry = async (uid: Uid | null) => {
  if (!uid) {
    return null;
  }

  let nft: Record<string, unknown>;
  for (let i = 0; i < 6; i++) {
    nft = await getNftById(uid);
    if (nft) {
      return nft;
    }
    await sleep(5);
  }
};

export const useGetNftById = (uid: Uid | null) => {
  return useQuery(["getNftsByUserId", uid ? uid.toHexString() : null], async () => {
    return getNftById(uid);
  });
};
