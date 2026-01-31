// API Configuration
export const API_CONFIG = {
  // Alchemy Solana RPC
  alchemy: {
    devnet: "https://solana-devnet.g.alchemy.com/v2/xhh60CwGA8HcI7QauuFz7",
    mainnet: "https://solana-mainnet.g.alchemy.com/v2/xhh60CwGA8HcI7QauuFz7",
  },

  // CoinGecko API
  coingecko: {
    baseUrl: "https://api.coingecko.com/api/v3",
    // Free tier - no API key needed
    // Pro tier - add your API key here if you have one
    apiKey: "", // Optional: Add your CoinGecko Pro API key
  },

  // Network settings
  network: "mainnet", // Change to 'mainnet' for production

  // Threshold for large wallet movements
  largeTransferThreshold: 100, // SOL
};

export default API_CONFIG;
