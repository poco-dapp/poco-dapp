import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

/** The block at which the query should be executed. */
export type Block_Height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['Bytes']>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars['Int']>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Nft = {
  __typename?: 'Nft';
  createdAtTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  metadata?: Maybe<NftMetadata>;
  minter: Scalars['Bytes'];
  minterUser: User;
  nftUid: Scalars['Bytes'];
  nftUri: Scalars['String'];
};

export type NftMetadata = {
  __typename?: 'NftMetadata';
  documentUri?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  nft?: Maybe<Nft>;
  organizationAddress?: Maybe<Scalars['String']>;
  organizationBlockchainWalletAddress?: Maybe<Scalars['String']>;
  organizationName?: Maybe<Scalars['String']>;
  organizationWebsite?: Maybe<Scalars['String']>;
  productDescription?: Maybe<Scalars['String']>;
  productName?: Maybe<Scalars['String']>;
  productReferenceNum?: Maybe<Scalars['String']>;
};

export type NftMetadata_Filter = {
  documentUri?: InputMaybe<Scalars['String']>;
  documentUri_contains?: InputMaybe<Scalars['String']>;
  documentUri_contains_nocase?: InputMaybe<Scalars['String']>;
  documentUri_ends_with?: InputMaybe<Scalars['String']>;
  documentUri_ends_with_nocase?: InputMaybe<Scalars['String']>;
  documentUri_gt?: InputMaybe<Scalars['String']>;
  documentUri_gte?: InputMaybe<Scalars['String']>;
  documentUri_in?: InputMaybe<Array<Scalars['String']>>;
  documentUri_lt?: InputMaybe<Scalars['String']>;
  documentUri_lte?: InputMaybe<Scalars['String']>;
  documentUri_not?: InputMaybe<Scalars['String']>;
  documentUri_not_contains?: InputMaybe<Scalars['String']>;
  documentUri_not_contains_nocase?: InputMaybe<Scalars['String']>;
  documentUri_not_ends_with?: InputMaybe<Scalars['String']>;
  documentUri_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  documentUri_not_in?: InputMaybe<Array<Scalars['String']>>;
  documentUri_not_starts_with?: InputMaybe<Scalars['String']>;
  documentUri_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  documentUri_starts_with?: InputMaybe<Scalars['String']>;
  documentUri_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nft?: InputMaybe<Scalars['String']>;
  nft_contains?: InputMaybe<Scalars['String']>;
  nft_contains_nocase?: InputMaybe<Scalars['String']>;
  nft_ends_with?: InputMaybe<Scalars['String']>;
  nft_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nft_gt?: InputMaybe<Scalars['String']>;
  nft_gte?: InputMaybe<Scalars['String']>;
  nft_in?: InputMaybe<Array<Scalars['String']>>;
  nft_lt?: InputMaybe<Scalars['String']>;
  nft_lte?: InputMaybe<Scalars['String']>;
  nft_not?: InputMaybe<Scalars['String']>;
  nft_not_contains?: InputMaybe<Scalars['String']>;
  nft_not_contains_nocase?: InputMaybe<Scalars['String']>;
  nft_not_ends_with?: InputMaybe<Scalars['String']>;
  nft_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nft_not_in?: InputMaybe<Array<Scalars['String']>>;
  nft_not_starts_with?: InputMaybe<Scalars['String']>;
  nft_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  nft_starts_with?: InputMaybe<Scalars['String']>;
  nft_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationAddress?: InputMaybe<Scalars['String']>;
  organizationAddress_contains?: InputMaybe<Scalars['String']>;
  organizationAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationAddress_ends_with?: InputMaybe<Scalars['String']>;
  organizationAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationAddress_gt?: InputMaybe<Scalars['String']>;
  organizationAddress_gte?: InputMaybe<Scalars['String']>;
  organizationAddress_in?: InputMaybe<Array<Scalars['String']>>;
  organizationAddress_lt?: InputMaybe<Scalars['String']>;
  organizationAddress_lte?: InputMaybe<Scalars['String']>;
  organizationAddress_not?: InputMaybe<Scalars['String']>;
  organizationAddress_not_contains?: InputMaybe<Scalars['String']>;
  organizationAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  organizationAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  organizationAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  organizationAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationAddress_starts_with?: InputMaybe<Scalars['String']>;
  organizationAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_contains?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_ends_with?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_gt?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_gte?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_in?: InputMaybe<Array<Scalars['String']>>;
  organizationBlockchainWalletAddress_lt?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_lte?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_not?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_not_contains?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  organizationBlockchainWalletAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_starts_with?: InputMaybe<Scalars['String']>;
  organizationBlockchainWalletAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationName?: InputMaybe<Scalars['String']>;
  organizationName_contains?: InputMaybe<Scalars['String']>;
  organizationName_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationName_ends_with?: InputMaybe<Scalars['String']>;
  organizationName_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationName_gt?: InputMaybe<Scalars['String']>;
  organizationName_gte?: InputMaybe<Scalars['String']>;
  organizationName_in?: InputMaybe<Array<Scalars['String']>>;
  organizationName_lt?: InputMaybe<Scalars['String']>;
  organizationName_lte?: InputMaybe<Scalars['String']>;
  organizationName_not?: InputMaybe<Scalars['String']>;
  organizationName_not_contains?: InputMaybe<Scalars['String']>;
  organizationName_not_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationName_not_ends_with?: InputMaybe<Scalars['String']>;
  organizationName_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationName_not_in?: InputMaybe<Array<Scalars['String']>>;
  organizationName_not_starts_with?: InputMaybe<Scalars['String']>;
  organizationName_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationName_starts_with?: InputMaybe<Scalars['String']>;
  organizationName_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationWebsite?: InputMaybe<Scalars['String']>;
  organizationWebsite_contains?: InputMaybe<Scalars['String']>;
  organizationWebsite_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationWebsite_ends_with?: InputMaybe<Scalars['String']>;
  organizationWebsite_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationWebsite_gt?: InputMaybe<Scalars['String']>;
  organizationWebsite_gte?: InputMaybe<Scalars['String']>;
  organizationWebsite_in?: InputMaybe<Array<Scalars['String']>>;
  organizationWebsite_lt?: InputMaybe<Scalars['String']>;
  organizationWebsite_lte?: InputMaybe<Scalars['String']>;
  organizationWebsite_not?: InputMaybe<Scalars['String']>;
  organizationWebsite_not_contains?: InputMaybe<Scalars['String']>;
  organizationWebsite_not_contains_nocase?: InputMaybe<Scalars['String']>;
  organizationWebsite_not_ends_with?: InputMaybe<Scalars['String']>;
  organizationWebsite_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  organizationWebsite_not_in?: InputMaybe<Array<Scalars['String']>>;
  organizationWebsite_not_starts_with?: InputMaybe<Scalars['String']>;
  organizationWebsite_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  organizationWebsite_starts_with?: InputMaybe<Scalars['String']>;
  organizationWebsite_starts_with_nocase?: InputMaybe<Scalars['String']>;
  productDescription?: InputMaybe<Scalars['String']>;
  productDescription_contains?: InputMaybe<Scalars['String']>;
  productDescription_contains_nocase?: InputMaybe<Scalars['String']>;
  productDescription_ends_with?: InputMaybe<Scalars['String']>;
  productDescription_ends_with_nocase?: InputMaybe<Scalars['String']>;
  productDescription_gt?: InputMaybe<Scalars['String']>;
  productDescription_gte?: InputMaybe<Scalars['String']>;
  productDescription_in?: InputMaybe<Array<Scalars['String']>>;
  productDescription_lt?: InputMaybe<Scalars['String']>;
  productDescription_lte?: InputMaybe<Scalars['String']>;
  productDescription_not?: InputMaybe<Scalars['String']>;
  productDescription_not_contains?: InputMaybe<Scalars['String']>;
  productDescription_not_contains_nocase?: InputMaybe<Scalars['String']>;
  productDescription_not_ends_with?: InputMaybe<Scalars['String']>;
  productDescription_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  productDescription_not_in?: InputMaybe<Array<Scalars['String']>>;
  productDescription_not_starts_with?: InputMaybe<Scalars['String']>;
  productDescription_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  productDescription_starts_with?: InputMaybe<Scalars['String']>;
  productDescription_starts_with_nocase?: InputMaybe<Scalars['String']>;
  productName?: InputMaybe<Scalars['String']>;
  productName_contains?: InputMaybe<Scalars['String']>;
  productName_contains_nocase?: InputMaybe<Scalars['String']>;
  productName_ends_with?: InputMaybe<Scalars['String']>;
  productName_ends_with_nocase?: InputMaybe<Scalars['String']>;
  productName_gt?: InputMaybe<Scalars['String']>;
  productName_gte?: InputMaybe<Scalars['String']>;
  productName_in?: InputMaybe<Array<Scalars['String']>>;
  productName_lt?: InputMaybe<Scalars['String']>;
  productName_lte?: InputMaybe<Scalars['String']>;
  productName_not?: InputMaybe<Scalars['String']>;
  productName_not_contains?: InputMaybe<Scalars['String']>;
  productName_not_contains_nocase?: InputMaybe<Scalars['String']>;
  productName_not_ends_with?: InputMaybe<Scalars['String']>;
  productName_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  productName_not_in?: InputMaybe<Array<Scalars['String']>>;
  productName_not_starts_with?: InputMaybe<Scalars['String']>;
  productName_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  productName_starts_with?: InputMaybe<Scalars['String']>;
  productName_starts_with_nocase?: InputMaybe<Scalars['String']>;
  productReferenceNum?: InputMaybe<Scalars['String']>;
  productReferenceNum_contains?: InputMaybe<Scalars['String']>;
  productReferenceNum_contains_nocase?: InputMaybe<Scalars['String']>;
  productReferenceNum_ends_with?: InputMaybe<Scalars['String']>;
  productReferenceNum_ends_with_nocase?: InputMaybe<Scalars['String']>;
  productReferenceNum_gt?: InputMaybe<Scalars['String']>;
  productReferenceNum_gte?: InputMaybe<Scalars['String']>;
  productReferenceNum_in?: InputMaybe<Array<Scalars['String']>>;
  productReferenceNum_lt?: InputMaybe<Scalars['String']>;
  productReferenceNum_lte?: InputMaybe<Scalars['String']>;
  productReferenceNum_not?: InputMaybe<Scalars['String']>;
  productReferenceNum_not_contains?: InputMaybe<Scalars['String']>;
  productReferenceNum_not_contains_nocase?: InputMaybe<Scalars['String']>;
  productReferenceNum_not_ends_with?: InputMaybe<Scalars['String']>;
  productReferenceNum_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  productReferenceNum_not_in?: InputMaybe<Array<Scalars['String']>>;
  productReferenceNum_not_starts_with?: InputMaybe<Scalars['String']>;
  productReferenceNum_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  productReferenceNum_starts_with?: InputMaybe<Scalars['String']>;
  productReferenceNum_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum NftMetadata_OrderBy {
  DocumentUri = 'documentUri',
  Id = 'id',
  Nft = 'nft',
  OrganizationAddress = 'organizationAddress',
  OrganizationBlockchainWalletAddress = 'organizationBlockchainWalletAddress',
  OrganizationName = 'organizationName',
  OrganizationWebsite = 'organizationWebsite',
  ProductDescription = 'productDescription',
  ProductName = 'productName',
  ProductReferenceNum = 'productReferenceNum'
}

export type Nft_Filter = {
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  minter?: InputMaybe<Scalars['Bytes']>;
  minterUser?: InputMaybe<Scalars['String']>;
  minterUser_contains?: InputMaybe<Scalars['String']>;
  minterUser_contains_nocase?: InputMaybe<Scalars['String']>;
  minterUser_ends_with?: InputMaybe<Scalars['String']>;
  minterUser_ends_with_nocase?: InputMaybe<Scalars['String']>;
  minterUser_gt?: InputMaybe<Scalars['String']>;
  minterUser_gte?: InputMaybe<Scalars['String']>;
  minterUser_in?: InputMaybe<Array<Scalars['String']>>;
  minterUser_lt?: InputMaybe<Scalars['String']>;
  minterUser_lte?: InputMaybe<Scalars['String']>;
  minterUser_not?: InputMaybe<Scalars['String']>;
  minterUser_not_contains?: InputMaybe<Scalars['String']>;
  minterUser_not_contains_nocase?: InputMaybe<Scalars['String']>;
  minterUser_not_ends_with?: InputMaybe<Scalars['String']>;
  minterUser_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  minterUser_not_in?: InputMaybe<Array<Scalars['String']>>;
  minterUser_not_starts_with?: InputMaybe<Scalars['String']>;
  minterUser_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  minterUser_starts_with?: InputMaybe<Scalars['String']>;
  minterUser_starts_with_nocase?: InputMaybe<Scalars['String']>;
  minter_contains?: InputMaybe<Scalars['Bytes']>;
  minter_in?: InputMaybe<Array<Scalars['Bytes']>>;
  minter_not?: InputMaybe<Scalars['Bytes']>;
  minter_not_contains?: InputMaybe<Scalars['Bytes']>;
  minter_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  nftUid?: InputMaybe<Scalars['Bytes']>;
  nftUid_contains?: InputMaybe<Scalars['Bytes']>;
  nftUid_in?: InputMaybe<Array<Scalars['Bytes']>>;
  nftUid_not?: InputMaybe<Scalars['Bytes']>;
  nftUid_not_contains?: InputMaybe<Scalars['Bytes']>;
  nftUid_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  nftUri?: InputMaybe<Scalars['String']>;
  nftUri_contains?: InputMaybe<Scalars['String']>;
  nftUri_contains_nocase?: InputMaybe<Scalars['String']>;
  nftUri_ends_with?: InputMaybe<Scalars['String']>;
  nftUri_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nftUri_gt?: InputMaybe<Scalars['String']>;
  nftUri_gte?: InputMaybe<Scalars['String']>;
  nftUri_in?: InputMaybe<Array<Scalars['String']>>;
  nftUri_lt?: InputMaybe<Scalars['String']>;
  nftUri_lte?: InputMaybe<Scalars['String']>;
  nftUri_not?: InputMaybe<Scalars['String']>;
  nftUri_not_contains?: InputMaybe<Scalars['String']>;
  nftUri_not_contains_nocase?: InputMaybe<Scalars['String']>;
  nftUri_not_ends_with?: InputMaybe<Scalars['String']>;
  nftUri_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nftUri_not_in?: InputMaybe<Array<Scalars['String']>>;
  nftUri_not_starts_with?: InputMaybe<Scalars['String']>;
  nftUri_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  nftUri_starts_with?: InputMaybe<Scalars['String']>;
  nftUri_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Nft_OrderBy {
  CreatedAtTimestamp = 'createdAtTimestamp',
  Id = 'id',
  Metadata = 'metadata',
  Minter = 'minter',
  MinterUser = 'minterUser',
  NftUid = 'nftUid',
  NftUri = 'nftUri'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  nft?: Maybe<Nft>;
  nftMetadata: Array<NftMetadata>;
  nfts: Array<Nft>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryNftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNftMetadataArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NftMetadata_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NftMetadata_Filter>;
};


export type QueryNftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Nft_Filter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  nft?: Maybe<Nft>;
  nftMetadata: Array<NftMetadata>;
  nfts: Array<Nft>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionNftArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNftMetadataArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NftMetadata_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NftMetadata_Filter>;
};


export type SubscriptionNftsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Nft_Filter>;
};


export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  nftsMinted: Array<Nft>;
};


export type UserNftsMintedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nft_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Nft_Filter>;
};

export type User_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum User_OrderBy {
  Id = 'id',
  NftsMinted = 'nftsMinted'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetNftsByUserIdQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetNftsByUserIdQuery = { __typename?: 'Query', user?: { __typename?: 'User', nftsMinted: Array<{ __typename?: 'Nft', id: string, createdAtTimestamp: any, metadata?: { __typename?: 'NftMetadata', organizationName?: string | null, organizationBlockchainWalletAddress?: string | null, organizationAddress?: string | null, organizationWebsite?: string | null, productName?: string | null, productReferenceNum?: string | null, productDescription?: string | null, documentUri?: string | null } | null }> } | null };

export type GetNftByIdQueryVariables = Exact<{
  nftId: Scalars['ID'];
}>;


export type GetNftByIdQuery = { __typename?: 'Query', nft?: { __typename?: 'Nft', id: string, createdAtTimestamp: any, metadata?: { __typename?: 'NftMetadata', organizationName?: string | null, organizationBlockchainWalletAddress?: string | null, organizationAddress?: string | null, organizationWebsite?: string | null, productName?: string | null, productReferenceNum?: string | null, productDescription?: string | null, documentUri?: string | null } | null } | null };

export type NftFieldsFragment = { __typename?: 'Nft', id: string, createdAtTimestamp: any, metadata?: { __typename?: 'NftMetadata', organizationName?: string | null, organizationBlockchainWalletAddress?: string | null, organizationAddress?: string | null, organizationWebsite?: string | null, productName?: string | null, productReferenceNum?: string | null, productDescription?: string | null, documentUri?: string | null } | null };

export const NftFieldsFragmentDoc = gql`
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
export const GetNftsByUserIdDocument = gql`
    query getNftsByUserId($userId: ID!) {
  user(id: $userId) {
    nftsMinted(orderBy: createdAtTimestamp, orderDirection: desc) {
      ...NftFields
    }
  }
}
    ${NftFieldsFragmentDoc}`;
export const GetNftByIdDocument = gql`
    query getNftById($nftId: ID!) {
  nft(id: $nftId) {
    ...NftFields
  }
}
    ${NftFieldsFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getNftsByUserId(variables: GetNftsByUserIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNftsByUserIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNftsByUserIdQuery>(GetNftsByUserIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNftsByUserId', 'query');
    },
    getNftById(variables: GetNftByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNftByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNftByIdQuery>(GetNftByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNftById', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;