import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { DEVELOPMENT_CHAINS } from "../helper-hardhat-config";

const DECIMALS = "8";
const INITIAL_PRICE = String(0.5 * 1e8);
const deployMocks: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });
    log("Mocks Deployed!");
  }
};
export default deployMocks;
deployMocks.tags = ["all", "mocks"];
