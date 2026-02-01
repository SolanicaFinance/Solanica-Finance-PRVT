// API Configuration
export const API_CONFIG = {
  // Helius Solana RPC
  helius: {
    devnet: "https://devnet.helius-rpc.com/?api-key=eb4c1be9-f523-43e3-b87a-38099801dc8f",
    mainnet: "https://mainnet.helius-rpc.com/?api-key=eb4c1be9-f523-43e3-b87a-38099801dc8f",
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
