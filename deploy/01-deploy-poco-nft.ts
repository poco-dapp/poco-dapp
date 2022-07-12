/* eslint-disable no-undef */

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { BigNumber, utils } from "ethers";

import { DEVELOPMENT_CHAINS, networkConfig } from "../helper-hardhat-config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, network, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let maticUsdPriceFeed: string;
  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    maticUsdPriceFeed = ethUsdAggregator.address;
  } else {
    maticUsdPriceFeed = networkConfig[network.name].maticUsdPriceFeed!;
  }

  const mintFeeCents = networkConfig[network.name].mintFeeCents;

  const projectPoco = await deploy("PocoNft", {
    from: deployer,
    args: [mintFeeCents, maticUsdPriceFeed],
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

func.tags = ["all"];

export default func;
