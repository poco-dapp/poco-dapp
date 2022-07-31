import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { SUBGRAPH_API_URL } from "./constants";
import { sleep } from "./misc";
import { Uid } from "./uid-generator";
import { getSdk, GetNftByIdQuery } from "../graphql/generated";

const graphQLClient = new GraphQLClient(SUBGRAPH_API_URL, {});

export const useGetNftsByUserId = (userId: string | undefined) => {
  const normalizedUserId = userId && userId.toLowerCase();

  return useQuery(["getNftsByUserId", normalizedUserId], async () => {
    if (!normalizedUserId) {
      return [];
    }

    const { user } = await getSdk(graphQLClient).getNftsByUserId({ userId: normalizedUserId });

    return user ? user.nftsMinted : [];
  });
};

export const getNftById = async (uid: Uid | null) => {
  if (!uid) {
    return null;
  }

  const { nft } = await getSdk(graphQLClient).getNftById({ nftId: uid.toHexString() });

  return nft;
};

/**
 * If nftdata is null, retry for sometime as there could be a delay in indexing at the Graph protocol
 */
export const getNftByIdWithRetry = async (uid: Uid | null) => {
  if (!uid) {
    return null;
  }

  let nft: GetNftByIdQuery["nft"];
  for (let i = 0; i < 12; i++) {
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
