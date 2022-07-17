import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { DEVELOPMENT_CHAINS } from "../../helper-hardhat-config";
import { MockV3Aggregator, PocoNft } from "../../typechain";
import { Uid } from "../../common/uid-helper";
import { BigNumber, providers } from "ethers";

export const suiteFunction = !DEVELOPMENT_CHAINS.includes(network.name)
  ? describe.skip
  : describe("PocoNft", function () {
      let pocoNft: PocoNft;
      let mockV3Aggregator: MockV3Aggregator;
      let deployer: SignerWithAddress;
      let user1: SignerWithAddress;
      let user2: SignerWithAddress;
      let validEthAmount: number;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];

        await deployments.fixture(["all"]);
        pocoNft = await ethers.getContract("PocoNft");
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator");

        const mintFeeMicroUsd = await pocoNft.mintFeeMicroUsd();
        const [, usdRate] = await mockV3Aggregator.latestRoundData();
        const usdRateDecimals = await mockV3Aggregator.decimals();
        const mintFeeScaled = BigNumber.from(mintFeeMicroUsd).mul(10 ** (usdRateDecimals - 6));

        validEthAmount = mintFeeScaled.toNumber() / usdRate.toNumber();
      });

      describe("constructor", async function () {
        it("constructor arguments set correctly", async () => {
          const isMintEnabled = await pocoNft.isMintEnabled();
          const mintFeeMicroUsd = await pocoNft.mintFeeMicroUsd();
          const mintFeeRangeLimitPercent = await pocoNft.mintFeeRangeLimitPercent();
          const priceFeed = await pocoNft.priceFeed();
          const contractOwner = await pocoNft.owner();

          assert.equal(isMintEnabled, true);
          assert.equal(mintFeeMicroUsd, 0.05 * 1e6);
          assert.equal(mintFeeRangeLimitPercent, 20);
          assert.equal(priceFeed, mockV3Aggregator.address);
          assert.equal(contractOwner, deployer.address);
        });
      });

      describe("mintNft", async function () {
        it("Should allow user1 to mint", async () => {
          const uid = Uid.generateUid();
          const user1IpfsUri = "ipfs://user1";

          const tx = await pocoNft.connect(user1).mintNft(uid.toHexString(), user1IpfsUri, {
            value: ethers.utils.parseEther(validEthAmount.toString()),
          });
          await tx.wait(1);

          const nftUri = await pocoNft.getNftUriByUid(uid.toHexString());
          const nftId = await pocoNft.getNftIdByUid(uid.toHexString());
          const nftOwner = await pocoNft.ownerOf(nftId);

          assert.equal(nftUri, user1IpfsUri);
          assert.equal(nftOwner, user1.address);
        });

        it("Should fail when sent ETH is above mint fee", async () => {
          const mintFeeRangeLimitPercent = await pocoNft.mintFeeRangeLimitPercent();
          const ethAmount = validEthAmount * (1 + (mintFeeRangeLimitPercent + 1) / 100);
          const uid = Uid.generateUid();
          const user1IpfsUri = "ipfs://user1";
          const tx = pocoNft.connect(user1).mintNft(uid.toHexString(), user1IpfsUri, {
            value: ethers.utils.parseEther(ethAmount.toString()),
          });

          await expect(tx).to.be.revertedWith("Unexpected mint fee");
        });

        // TODO: Check Mint enabled and log events, withdraw balance
      });
    });
