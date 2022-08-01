import fs from "fs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { frontEndContractsFile, frontEndAbiFile } from "../helper-hardhat-config";
import { runTypeChain, glob } from "typechain";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("Writing to front end...");
  await updateContractAddresses(hre);
  await updateAbi(hre);
  await updateTsBindings();
  console.log("Front end written!");
};

async function updateAbi(hre: HardhatRuntimeEnvironment) {
  const pocoNft = await hre.ethers.getContract("PocoNft");
  fs.writeFileSync(frontEndAbiFile, pocoNft.interface.format(hre.ethers.utils.FormatTypes.json));
}

async function updateContractAddresses(hre: HardhatRuntimeEnvironment) {
  const pocoNft = await hre.ethers.getContract("PocoNft");
  const chainsConfig = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"));

  const chainId = hre.network.config.chainId || "31337";

  chainsConfig[chainId].contractAddress = pocoNft.address;
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(chainsConfig));
}

async function updateTsBindings() {
  const cwd = process.cwd();
  const allFiles = glob(cwd, [`./artifacts/!(build-info)/**/+([a-zA-Z0-9_]).json`]);

  await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: "./frontend/typechain",
    target: "ethers-v5",
  });
}

func.tags = ["frontend", "testnet"];

export default func;
