/* eslint-disable no-undef */

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { DEVELOPMENT_CHAINS, networkConfig } from "../helper-hardhat-config";

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

  await deploy("PocoNft", {
    from: deployer,
    args: [isMintEnabled, mintFeeMicroUsd, mintFeeRangeLimitPercent, usdPriceFeed],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });

  //   // Verify the deployment
  //   if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //     log("Verifying...")
  //     await verify(raffle.address, arguments)
  // }

  // log("Enter lottery with command:")
  // const networkName = network.name == "hardhat" ? "localhost" : network.name
  // log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
  // log("----------------------------------------------------")
};

func.tags = ["all", "PocoNft"];

export default func;
