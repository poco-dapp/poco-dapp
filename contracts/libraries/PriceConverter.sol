// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
  uint256 constant ETH_DECIMALS = 10**18;

  function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
    (, int256 answer, , , ) = priceFeed.latestRoundData();
    uint8 priceFeedDecimals = priceFeed.decimals();
    return uint256(answer) * (ETH_DECIMALS / (10**priceFeedDecimals));
  }

  function getConversionRateCents(uint256 ethAmount, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    uint256 ethPrice = getPrice(priceFeed);
    uint256 ethAmountInCents = (ethPrice * ethAmount * 100) / (ETH_DECIMALS**2);
    return ethAmountInCents;
  }
}
