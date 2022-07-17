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
      const USER1_NFT_URI = `ipfs://${"a".repeat(47)}`;
      let pocoNft: PocoNft;
      let mockV3Aggregator: MockV3Aggregator;
      let deployer: SignerWithAddress;
      let user1: SignerWithAddress;
      let validEthAmount: number;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user1 = accounts[1];

        await deployments.fixture(["all"]);
        pocoNft = await ethers.getContract("PocoNft");
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator");

        const mintFeeMicroUsd = await pocoNft.mintFeeMicroUsd();
        const [, usdRate] = await mockV3Aggregator.latestRoundData();
        const usdRateDecimals = await mockV3Aggregator.decimals();
        const mintFeeScaled = BigNumber.from(mintFeeMicroUsd).mul(10 ** (usdRateDecimals - 6));

        validEthAmount = mintFeeScaled.toNumber() / usdRate.toNumber();
      });

      describe("constructor", () => {
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

      describe("mintNft", () => {
        it("Should allow user1 to mint", async () => {
          const uid = Uid.generateUid();

          const tx = await pocoNft.connect(user1).mintNft(uid.toHexString(), USER1_NFT_URI, {
            value: ethers.utils.parseEther(validEthAmount.toString()),
          });
          await tx.wait();

          const nftUri = await pocoNft.getNftUriByUid(uid.toHexString());
          const nftId = await pocoNft.getNftIdByUid(uid.toHexString());
          const nftOwner = await pocoNft.ownerOf(nftId);

          assert.equal(nftUri, USER1_NFT_URI);
          assert.equal(nftOwner, user1.address);
        });

        it("Should fail when sent ETH is above mint fee", async () => {
          const mintFeeRangeLimitPercent = await pocoNft.mintFeeRangeLimitPercent();
          const ethAmount = validEthAmount * (1 + (mintFeeRangeLimitPercent + 1) / 100);
          const uid = Uid.generateUid();
          const tx = pocoNft.connect(user1).mintNft(uid.toHexString(), USER1_NFT_URI, {
            value: ethers.utils.parseEther(ethAmount.toString()),
          });

          await expect(tx).to.be.revertedWith("Unexpected mint fee");
        });

        it("Should log event after a mint", async () => {
          const uid = Uid.generateUid();

          const tx = await pocoNft.connect(user1).mintNft(uid.toHexString(), USER1_NFT_URI, {
            value: ethers.utils.parseEther(validEthAmount.toString()),
          });
          await tx.wait();

          const filter = pocoNft.filters.NftMinted(user1.address);
          const events = await pocoNft.queryFilter(filter, "latest");

          events.forEach((event) => {
            assert.equal(event.args.minter, user1.address);
            assert.equal(event.args.nftUid, uid.toHexString());
          });
        });
      });

      describe("setIsMintEnabled", () => {
        it("Only contract owner should be allowed to disable minting", async () => {
          const tx1 = pocoNft.connect(user1).setIsMintEnabled(false);

          await expect(tx1).to.be.revertedWith("Ownable: caller is not the owner");

          await pocoNft.connect(deployer).setIsMintEnabled(false);

          const isMintEnabled = await pocoNft.isMintEnabled();
          assert.equal(isMintEnabled, false);
        });

        it("Should prevent minting if flag is disabled", async () => {
          await pocoNft.connect(deployer).setIsMintEnabled(false);

          const uid = Uid.generateUid();

          const tx = pocoNft.connect(user1).mintNft(uid.toHexString(), USER1_NFT_URI, {
            value: ethers.utils.parseEther(validEthAmount.toString()),
          });
          await expect(tx).to.be.revertedWith("Minting has been disabled");
        });
      });

      describe("withdrawContractBalance", () => {
        beforeEach(async () => {
          const uid = Uid.generateUid();

          const tx = await pocoNft.connect(user1).mintNft(uid.toHexString(), USER1_NFT_URI, {
            value: ethers.utils.parseEther(validEthAmount.toString()),
          });
          await tx.wait();
        });

        it("Should only allow contract owner to withdraw balance", async () => {
          const tx1 = pocoNft.connect(user1).withdrawContractBalance();

          await expect(tx1).to.be.revertedWith("Ownable: caller is not the owner");

          const contractStartingBalance = await pocoNft.provider.getBalance(pocoNft.address);
          const deployerStartingBalance = await deployer.getBalance();

          const tx3 = await pocoNft.connect(deployer).withdrawContractBalance();
          const txReceipt = await tx3.wait();
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const deployerEndingBalance = await deployer.getBalance();

          assert.equal(
            contractStartingBalance.add(deployerStartingBalance).toString(),
            deployerEndingBalance.add(gasCost).toString()
          );
        });
      });
    });
