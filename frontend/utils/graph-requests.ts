import { useQuery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";
import { SUBGRAPH_API_URL } from "./constants";

const graphQLClient = new GraphQLClient(SUBGRAPH_API_URL, {});

const GET_NFTS_BY_USER_ID = gql`
  query getNftsByUserId($userId: ID!) {
    user(id: $userId) {
      nftsMinted {
        id
        createdAtTimestamp
        metadata {
          productName
        }
      }
    }
  }
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
    return user.nftsMinted;
  });
};
