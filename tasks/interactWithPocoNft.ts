import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

import { Uid } from "../common/uid-helper";
import { MockV3Aggregator, PocoNft } from "../typechain";

task("interact:mint", "").setAction(async (args, hre: HardhatRuntimeEnvironment) => {
  const { deployer } = await hre.getNamedAccounts();
  const pocoNft: PocoNft = await hre.ethers.getContract("PocoNft");

  const hexifiedUuid = Uid.generateUid().toHexString();
  const sampleIpfsUri = `ipfs://${"a".repeat(47)}`;

  const result = await pocoNft.mintNft(hre.ethers.utils.arrayify(hexifiedUuid), sampleIpfsUri, {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await result.wait();

  const contractBalance = (await hre.ethers.provider.getBalance(pocoNft.address)).toString();
  const userBalance = (await hre.ethers.provider.getBalance(deployer)).toString();

  console.log("uuid:", hexifiedUuid);
  console.log("Contract balance: ", contractBalance);
  console.log("User balance: ", userBalance);
});

task("interact:getUri", "")
  .addParam("hexifieduuid", "")
  .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const pocoNft: PocoNft = await hre.ethers.getContract("PocoNft");

    const uri = await pocoNft.getNftUriByUid(args.hexifieduuid);
    console.log("URI: ", uri);
  });

task("interact:getEthAmountInMicroUsd", "")
  .addParam("eth", "")
  .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const pocoNft: PocoNft = await hre.ethers.getContract("PocoNft");

    const result = await pocoNft.getEthAmountInMicroUsd(hre.ethers.utils.parseEther(args.eth));
    console.log("ethAmountInMicroUsd: ", result.toString());
  });

task("interact:priceFeed", "").setAction(async (args, hre: HardhatRuntimeEnvironment) => {
  const mockV3Aggregator: MockV3Aggregator = await hre.ethers.getContract("MockV3Aggregator");

  mockV3Aggregator.decimals();
  const { answer } = await mockV3Aggregator.latestRoundData();

  console.log("decimals:", await mockV3Aggregator.decimals());
  console.log("Contract balance: ", answer.toString());
});
