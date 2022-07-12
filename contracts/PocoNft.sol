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

  mapping(bytes16 => uint256) private tokenUuidToId;
  Counters.Counter private tokenIds;

  event NftMinted(address indexed minter, bytes16 indexed tokenUuid, string tokenUri);

  event TokenUriUpdated(address indexed owner, bytes16 indexed tokenUuid, string tokenUri);

  modifier onlyNftOwner(bytes16 _tokenUuid) {
    uint256 tokenId = getTokenIdByUuid(_tokenUuid);
    require(_msgSender() == ownerOf(tokenId), "Caller is not owner.");
    _;
  }

  constructor(uint256 _mintFeeCents, address _priceFeed) Ownable() ERC721("PocoNFT", "POCO") {
    mintFeeCents = _mintFeeCents;
    priceFeed = AggregatorV3Interface(_priceFeed);
  }

  function mintNft(bytes16 _tokenUuid, string memory _tokenUri) public payable onlyOwner {
    uint256 ethAmountInCents = msg.value.getConversionRateCents(priceFeed);
    require(
      ethAmountInCents >= mintFeeCents && ethAmountInCents < mintFeeCents + 10,
      "Unexpected mint fee."
    );
    require(bytes(_tokenUri).length != 0, "Token URI needs to be valid.");
    require(tokenUuidToId[_tokenUuid] == 0, "NFT with provided UID already exists.");

    uint256 newTokenId = tokenIds.current();
    _safeMint(_msgSender(), newTokenId);
    _setTokenURI(newTokenId, _tokenUri);
    tokenUuidToId[_tokenUuid] = newTokenId;

    tokenIds.increment();
    emit NftMinted(_msgSender(), _tokenUuid, _tokenUri);
  }

  function getTokenUriByUuid(bytes16 _tokenUuid) public view returns (string memory) {
    uint256 tokenId = getTokenIdByUuid(_tokenUuid);
    string memory tokenUri = tokenURI(tokenId);
    return tokenUri;
  }

  function withdrawContractBalance() external onlyOwner {
    (bool success, ) = owner().call{value: address(this).balance}("");
    require(success, "Withdrawal error.");
  }

  function updateTokenUri(bytes16 _tokenUuid, string memory _tokenUri)
    external
    onlyNftOwner(_tokenUuid)
  {
    _setTokenURI(getTokenIdByUuid(_tokenUuid), _tokenUri);
    emit TokenUriUpdated(_msgSender(), _tokenUuid, _tokenUri);
  }

  function getTokenIdByUuid(bytes16 _tokenUuid) private view returns (uint256) {
    uint256 tokenId = tokenUuidToId[_tokenUuid];
    require(tokenId != 0, "UID does not exist.");
    return tokenId;
  }
}
