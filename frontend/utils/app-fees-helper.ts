import { ethers } from "ethers";
import { PocoNft } from "../typechain";

const APP_FEES_USD = 0.05;

export async function getAppFeesInMatic(contract: PocoNft): Promise<number> {
  const microUsdRate = await contract.getEthAmountInMicroUsd(ethers.utils.parseEther("1"));
  const usdRate = microUsdRate.toNumber() / 1e6;
  return APP_FEES_USD / usdRate;
}
