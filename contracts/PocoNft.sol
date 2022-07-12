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

  uint256 public immutable mintFeeCents;
  AggregatorV3Interface public priceFeed;

  mapping(bytes17 => uint256) private nftUidToId;
  Counters.Counter private nftIds;

  event NftMinted(address indexed minter, bytes17 indexed nftUid, string nftUri);

  event NftUriUpdated(address indexed owner, bytes17 indexed nftUid, string nftUri);

  modifier onlyNftOwner(bytes17 _nftUid) {
    uint256 nftId = getNftIdByUid(_nftUid);
    require(_msgSender() == ownerOf(nftId), "Caller is not owner.");
    _;
  }

  constructor(uint256 _mintFeeCents, address _priceFeed) Ownable() ERC721("PocoNFT", "POCO") {
    mintFeeCents = _mintFeeCents;
    priceFeed = AggregatorV3Interface(_priceFeed);
  }

  function mintNft(bytes17 _nftUid, string memory _nftUri) public payable {
    uint256 ethAmountInCents = msg.value.getConversionRateCents(priceFeed);
    require(
      ethAmountInCents >= mintFeeCents - 10 && ethAmountInCents < mintFeeCents + 10,
      "Unexpected mint fee."
    );
    require(bytes(_nftUri).length != 0, "Nft URI needs to be valid.");
    require(nftUidToId[_nftUid] == 0, "NFT with provided UID already exists.");

    uint256 newNftId = nftIds.current();
    _safeMint(_msgSender(), newNftId);
    _setTokenURI(newNftId, _nftUri);
    nftUidToId[_nftUid] = newNftId;

    nftIds.increment();
    emit NftMinted(_msgSender(), _nftUid, _nftUri);
  }

  function getNftUriByUid(bytes17 _nftUid) public view returns (string memory) {
    uint256 nftId = getNftIdByUid(_nftUid);
    string memory nftUri = tokenURI(nftId);
    return nftUri;
  }

  function withdrawContractBalance() external onlyOwner {
    (bool success, ) = owner().call{value: address(this).balance}("");
    require(success, "Withdrawal error.");
  }

  function updateNftUri(bytes17 _nftUid, string memory _nftUri) external onlyNftOwner(_nftUid) {
    _setTokenURI(getNftIdByUid(_nftUid), _nftUri);
    emit NftUriUpdated(_msgSender(), _nftUid, _nftUri);
  }

  function getNftIdByUid(bytes17 _nftUid) public view returns (uint256) {
    uint256 nftId = nftUidToId[_nftUid];
    require(nftId != 0, "UID does not exist.");
    return nftId;
  }
}
