// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./libraries/PriceConverter.sol";

contract PocoNft is Ownable, ERC721URIStorage {
  using Counters for Counters.Counter;
  using PriceConverter for uint256;

  /* ========== EVENTS ========== */

  event NftMinted(address indexed minter, bytes17 indexed nftUid, string nftUri);
  event NftUriUpdated(address indexed owner, bytes17 indexed nftUid, string nftUri);

  /* ========== MODIFIERS ========== */

  modifier onlyNftOwner(bytes17 _nftUid) {
    uint256 nftId = getNftIdByUid(_nftUid);
    require(_msgSender() == ownerOf(nftId), "Caller is not owner");
    _;
  }

  /* ========== STATE VARIABLES ========== */

  bool public isMintEnabled;
  uint32 public mintFeeMicroUsd;
  uint32 public mintFeeRangeLimitPercent;
  AggregatorV3Interface public priceFeed;

  mapping(bytes17 => uint256) private nftUidToId;
  Counters.Counter private nftIds;

  /* ========== CONSTRUCTOR ========== */

  constructor(
    bool _isMintEnabled,
    uint32 _mintFeeMicroUsd,
    uint32 _mintFeeRangeLimitPercent,
    address _priceFeed
  ) Ownable() ERC721("PocoNFT", "POCO") {
    isMintEnabled = _isMintEnabled;
    mintFeeMicroUsd = _mintFeeMicroUsd;
    mintFeeRangeLimitPercent = _mintFeeRangeLimitPercent;
    priceFeed = AggregatorV3Interface(_priceFeed);
    nftIds.increment();
  }

  /* ========== MUTATIVE FUNCTIONS ========== */

  function mintNft(bytes17 _nftUid, string memory _nftUri) public payable {
    require(isMintEnabled, "Minting has been disabled");

    uint256 ethAmountInMicroUsd = getEthAmountInMicroUsd(msg.value);
    uint32 mintFeeRangeLimit = (mintFeeMicroUsd * mintFeeRangeLimitPercent) / 100;
    require(
      ethAmountInMicroUsd >= mintFeeMicroUsd - mintFeeRangeLimit &&
        ethAmountInMicroUsd <= mintFeeMicroUsd + mintFeeRangeLimit,
      "Unexpected mint fee"
    );

    require(bytes(_nftUri).length > 53, "Nft URI needs to be valid");
    require(nftUidToId[_nftUid] == 0, "NFT with provided UID already exists");

    uint256 newNftId = nftIds.current();
    _safeMint(_msgSender(), newNftId);
    _setTokenURI(newNftId, _nftUri);
    nftUidToId[_nftUid] = newNftId;

    nftIds.increment();
    emit NftMinted(_msgSender(), _nftUid, _nftUri);
  }

  function updateNftUri(bytes17 _nftUid, string memory _nftUri) external onlyNftOwner(_nftUid) {
    _setTokenURI(getNftIdByUid(_nftUid), _nftUri);
    emit NftUriUpdated(_msgSender(), _nftUid, _nftUri);
  }

  /* ========== VIEW FUNCTIONS ========== */

  function getNftUriByUid(bytes17 _nftUid) public view returns (string memory) {
    uint256 nftId = getNftIdByUid(_nftUid);
    string memory nftUri = tokenURI(nftId);
    return nftUri;
  }

  function getNftIdByUid(bytes17 _nftUid) public view returns (uint256) {
    uint256 nftId = nftUidToId[_nftUid];
    require(nftId != 0, "UID does not exist");
    return nftId;
  }

  function getEthAmountInMicroUsd(uint256 _value) public view returns (uint256) {
    return _value.getEthAmountInMicroUsd(priceFeed);
  }

  function totalSupply() public view returns (uint256) {
    return nftIds.current();
  }

  /* ========== INTERNAL FUNCTIONS ========== */

  /* ========== ADMIN FUNCTIONS ========== */

  function withdrawContractBalance() external onlyOwner {
    (bool success, ) = owner().call{value: address(this).balance}("");
    require(success, "Withdrawal error");
  }

  function setIsMintEnabled(bool _isMintEnabled) external onlyOwner {
    isMintEnabled = _isMintEnabled;
  }

  function setMintFeeMicroUsd(uint32 _mintFeeMicroUsd) external onlyOwner {
    mintFeeMicroUsd = _mintFeeMicroUsd;
  }

  function setMintFeeRangeLimitPercent(uint32 _mintFeeRangeLimitPercent) external onlyOwner {
    mintFeeRangeLimitPercent = _mintFeeRangeLimitPercent;
  }
}
