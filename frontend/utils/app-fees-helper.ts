import { HARDHAT_LOCALHOST_CHAIN_ID } from "./constants";

const APP_FEES_USD = 1;
const LOCALHOST_APP_FEES_MATIC = 2;

interface CoingeckoApiResponse {
  "matic-network": { usd: number };
}

const COINGECKO_MATIC_PRICE_API =
  "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd";

export async function getAppFeesInMatic(chaindId: number): Promise<number> {
  if (chaindId === HARDHAT_LOCALHOST_CHAIN_ID) {
    return LOCALHOST_APP_FEES_MATIC;
  }
  const response = await fetch(COINGECKO_MATIC_PRICE_API);
  const data: CoingeckoApiResponse = await response.json();
  return APP_FEES_USD / data["matic-network"].usd;
}
