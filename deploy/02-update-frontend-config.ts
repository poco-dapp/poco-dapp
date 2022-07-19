import fs from "fs";

import { HardhatRuntimeEnvironment } from "hardhat/types";

import { DeployFunction } from "hardhat-deploy/types";

import { frontEndContractsFile, frontEndAbiFile } from "../helper-hardhat-config";

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
func.tags = ["frontend", "testnet"];

export default func;
