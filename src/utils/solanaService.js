import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { API_CONFIG } from "./apiConfig";

// Initialize connection
const getConnection = () => {
  const endpoint =
    API_CONFIG.network === "mainnet"
      ? API_CONFIG.helius.mainnet
      : API_CONFIG.helius.devnet;
  return new Connection(endpoint, "confirmed");
};

/**
 * Get wallet balance
 */
export const getWalletBalance = async (walletAddress) => {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return 0;
  }
};

/**
 * Get wallet transaction history
 */
export const getWalletTransactions = async (walletAddress, limit = 10) => {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);

    // Fetch transaction signatures
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit,
    });

    // Fetch full transaction details
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });
        return {
          signature: sig.signature,
          timestamp: sig.blockTime,
          slot: sig.slot,
          err: sig.err,
          ...tx,
        };
      })
    );

    return transactions.filter((tx) => tx !== null);
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    return [];
  }
};

/**
 * Get SPL token balances for a wallet
 */
export const getTokenBalances = async (walletAddress) => {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);

    // Get all token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      }
    );

    const tokens = tokenAccounts.value
      .map((accountInfo) => {
        const parsedInfo = accountInfo.account.data.parsed.info;
        return {
          mint: parsedInfo.mint,
          balance: parsedInfo.tokenAmount.uiAmount,
          decimals: parsedInfo.tokenAmount.decimals,
          uiAmountString: parsedInfo.tokenAmount.uiAmountString,
        };
      })
      .filter((token) => token.balance > 0);

    return tokens;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    return [];
  }
};

/**
 * Monitor recent large transactions on Solana
 */
export const getLargeTransactions = async (threshold = 100) => {
  try {
    const connection = getConnection();

    // Get recent block
    const slot = await connection.getSlot();
    const block = await connection.getBlock(slot, {
      maxSupportedTransactionVersion: 0,
    });

    if (!block) return [];

    const largeTransactions = [];

    for (const tx of block.transactions) {
      if (!tx.meta) continue;

      // Calculate SOL transfer amount
      const preBalances = tx.meta.preBalances;
      const postBalances = tx.meta.postBalances;

      for (let i = 0; i < preBalances.length; i++) {
        const change =
          Math.abs(postBalances[i] - preBalances[i]) / LAMPORTS_PER_SOL;

        if (change >= threshold) {
          largeTransactions.push({
            signature: tx.transaction.signatures[0],
            amount: change,
            from: tx.transaction.message.accountKeys[0]?.toString(),
            timestamp: block.blockTime,
            slot: slot,
          });
        }
      }
    }

    return largeTransactions.slice(0, 10);
  } catch (error) {
    console.error("Error fetching large transactions:", error);
    return [];
  }
};

/**
 * Get wallet statistics
 */
export const getWalletStats = async (walletAddress) => {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);

    // Get balance
    const balance = await getWalletBalance(walletAddress);

    // Get recent transactions
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 100,
    });

    // Calculate stats
    const totalTransactions = signatures.length;
    const oldestTx = signatures[signatures.length - 1];
    const newestTx = signatures[0];

    // Calculate age in days
    const ageInDays = oldestTx?.blockTime
      ? Math.floor((Date.now() / 1000 - oldestTx.blockTime) / 86400)
      : 0;

    return {
      address: walletAddress,
      balance,
      totalTransactions,
      ageInDays,
      lastActivity: newestTx?.blockTime,
    };
  } catch (error) {
    console.error("Error fetching wallet stats:", error);
    return null;
  }
};

/**
 * Format wallet address for display
 */
export const formatAddress = (address, chars = 4) => {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Format timestamp to readable date
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

/**
 * Format transaction type based on instruction
 */
export const getTransactionType = (transaction) => {
  if (!transaction?.meta) return "Unknown";

  const { preBalances, postBalances } = transaction.meta;

  // Check if first account (signer) gained or lost SOL
  if (postBalances[0] > preBalances[0]) {
    return "Receive";
  } else if (postBalances[0] < preBalances[0]) {
    return "Send";
  }

  return "Other";
};

export default {
  getWalletBalance,
  getWalletTransactions,
  getTokenBalances,
  getLargeTransactions,
  getWalletStats,
  formatAddress,
  formatTimestamp,
  getTransactionType,
};
