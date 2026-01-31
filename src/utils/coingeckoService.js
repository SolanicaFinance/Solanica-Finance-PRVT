import { API_CONFIG } from "./apiConfig";

const BASE_URL = API_CONFIG.coingecko.baseUrl;

/**
 * Fetch trending Solana tokens
 */
export const getTrendingTokens = async () => {
  try {
    const response = await fetch(`${BASE_URL}/search/trending`);
    const data = await response.json();

    // Filter for Solana tokens only
    const solanaTokens = data.coins
      .filter(
        (coin) =>
          coin.item.platforms &&
          Object.keys(coin.item.platforms).includes("solana")
      )
      .slice(0, 10);

    return solanaTokens;
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    return [];
  }
};

/**
 * Fetch top Solana tokens by market cap
 */
export const getTopSolanaTokens = async (limit = 20) => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h,7d`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top Solana tokens:", error);
    return [];
  }
};

/**
 * Fetch token details by contract address
 */
export const getTokenByContract = async (contractAddress) => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/solana/contract/${contractAddress}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching token details:", error);
    return null;
  }
};

/**
 * Fetch SOL price and market data
 */
export const getSolanaPrice = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
    );
    const data = await response.json();
    return {
      price: data.solana.usd,
      change24h: data.solana.usd_24h_change,
      volume24h: data.solana.usd_24h_vol,
      marketCap: data.solana.usd_market_cap,
    };
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    return null;
  }
};

/**
 * Format price with appropriate decimals
 */
export const formatPrice = (price) => {
  if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(6)}`;
  }
};

/**
 * Format percentage change with color
 */
export const formatChange = (change) => {
  const formatted = Math.abs(change).toFixed(2);
  return {
    value: `${change >= 0 ? "+" : "-"}${formatted}%`,
    isPositive: change >= 0,
  };
};

/**
 * Format large numbers (market cap, volume)
 */
export const formatLargeNumber = (num) => {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
};

export default {
  getTrendingTokens,
  getTopSolanaTokens,
  getTokenByContract,
  getSolanaPrice,
  formatPrice,
  formatChange,
  formatLargeNumber,
};
