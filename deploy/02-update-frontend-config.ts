import fs from "fs";

import { HardhatRuntimeEnvironment, Network } from "hardhat/types";

import { DeploymentsExtension, DeployFunction } from "hardhat-deploy/types";

import { frontEndContractsFile, frontEndAbiFile, networkConfig } from "../helper-hardhat-config";
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/src/types";
import type { ethers } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("Writing to front end...");
  await updateContractAddresses(hre);
  await updateAbi(hre);
  console.log("Front end written!");
};

async function updateAbi(hre: HardhatRuntimeEnvironment) {
  const pocoNft = await hre.ethers.getContract("PocoNft");
  fs.writeFileSync(frontEndAbiFile, pocoNft.interface.format(hre.ethers.utils.FormatTypes.json));
}

async function updateContractAddresses(hre: HardhatRuntimeEnvironment) {
  const pocoNft = await hre.ethers.getContract("PocoNft");
  const contractsConfig = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"));

  const chainId = hre.network.config.chainId || "31337";

  contractsConfig[chainId].address = pocoNft.address;
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractsConfig));
}
func.tags = ["frontend"];

export default func;
