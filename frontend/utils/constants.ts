export const PRIMARY_COLOR = "#1B1A52";
export const HARDHAT_LOCALHOST_CHAIN_ID = 31337;
export const POLYGON_TEST_MUMBAI_CHAIN_ID = 80001;

// Env
export const ENV_LOCAL = "local";
export const ENV_DEVELOPMENT = "development";
export const ENV_PRODUCTION = "production";
export const isLocalEnv = process.env.NEXT_PUBLIC_ENV === ENV_LOCAL;
export const isDevEnv = process.env.NEXT_PUBLIC_ENV === ENV_DEVELOPMENT;

// The Graph subgraph
export const SUBGRAPH_API_URL = isLocalEnv
  ? "http://localhost:8000/subgraphs/name/poco-dapp/poco"
  : "https://api.thegraph.com/subgraphs/name/poco-dapp/poco";
