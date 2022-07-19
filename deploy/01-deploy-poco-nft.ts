/* eslint-disable no-undef */

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { DEVELOPMENT_CHAINS, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, network, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let usdPriceFeed: string;
  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    usdPriceFeed = ethUsdAggregator.address;
  } else {
    usdPriceFeed = networkConfig[network.name].usdPriceFeed || "";
  }

  const isMintEnabled = true;
  const mintFeeMicroUsd = networkConfig[network.name].mintFeeMicroUsd;
  const mintFeeRangeLimitPercent = 20;

  const pocoNft = await deploy("PocoNft", {
    from: deployer,
    args: [isMintEnabled, mintFeeMicroUsd, mintFeeRangeLimitPercent, usdPriceFeed],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  console.log(`PocoNft deployed at ${pocoNft.address}`);

  if (!DEVELOPMENT_CHAINS.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
    await verify(pocoNft.address, [
      isMintEnabled,
      mintFeeMicroUsd,
      mintFeeRangeLimitPercent,
      usdPriceFeed,
    ]);
  }
};

func.tags = ["PocoNft", "unittest", "testnet"];

export default func;
