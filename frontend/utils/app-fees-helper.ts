import { HARDHAT_LOCALHOST_CHAIN_ID } from "./constants";

const APP_FEES_USD = 0.05;
const LOCALHOST_CHAIN_MOCK_MATIC_USD_RATE = 0.5;

interface CoingeckoApiResponse {
  "matic-network": { usd: number };
}

const COINGECKO_MATIC_PRICE_API =
  "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd";

export async function getAppFeesInMatic(chaindId: number): Promise<number> {
  let usdRate: number;
  if (chaindId === HARDHAT_LOCALHOST_CHAIN_ID) {
    usdRate = LOCALHOST_CHAIN_MOCK_MATIC_USD_RATE;
  } else {
    const response = await fetch(COINGECKO_MATIC_PRICE_API);
    const data: CoingeckoApiResponse = await response.json();
    usdRate = data["matic-network"].usd;
  }

  return APP_FEES_USD / usdRate;
}
