import React, { useState } from "react";
import {
  Search,
  Wallet,
  Clock,
  Hash,
  ExternalLink,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  getWalletStats,
  getTokenBalances,
  getWalletTransactions,
  formatAddress,
  formatTimestamp,
  getTransactionType,
} from "../utils/solanaService";
import { API_CONFIG } from "../utils/apiConfig";

const WalletTracker = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    setLoading(true);
    setError("");
    setWalletData(null);
    setTokens([]);
    setTransactions([]);

    try {
      // Fetch wallet stats
      const stats = await getWalletStats(address);
      setWalletData(stats);

      // Fetch token balances
      const tokenData = await getTokenBalances(address);
      setTokens(tokenData);

      // Fetch recent transactions
      const txData = await getWalletTransactions(address, 10);
      setTransactions(txData);
    } catch (err) {
      setError(
        "Failed to fetch wallet data. Please check the address and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getExplorerUrl = (signature) => {
    const network = API_CONFIG.network === "mainnet" ? "" : "?cluster=devnet";
    return `https://solscan.io/tx/${signature}${network}`;
  };

  const getAccountExplorerUrl = (address) => {
    const network = API_CONFIG.network === "mainnet" ? "" : "?cluster=devnet";
    return `https://solscan.io/account/${address}${network}`;
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-bold text-white">Wallet Tracker</h2>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Solana wallet address..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Wallet Stats */}
      {walletData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-4 h-4 text-green-500" />
              <p className="text-sm text-gray-400">Balance</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {walletData.balance.toFixed(4)} SOL
            </p>
          </div>

          <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-4 h-4 text-blue-500" />
              <p className="text-sm text-gray-400">Transactions</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {walletData.totalTransactions}
            </p>
          </div>

          <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <p className="text-sm text-gray-400">Wallet Age</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {walletData.ageInDays} days
            </p>
          </div>

          <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <p className="text-sm text-gray-400">Last Activity</p>
            </div>
            <p className="text-sm font-medium text-white">
              {formatTimestamp(walletData.lastActivity).split(",")[0]}
            </p>
          </div>
        </div>
      )}

      {/* Token Holdings */}
      {tokens.length > 0 && (
        <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Token Holdings</h3>
          <div className="space-y-2">
            {tokens.map((token, index) => (
              <div
                key={token.mint + index}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm text-white">
                    {formatAddress(token.mint, 8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Decimals: {token.decimals}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {token.balance.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-500">Balance</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Recent Transactions
            </h3>
            <a
              href={getAccountExplorerUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-500 hover:text-green-400 flex items-center space-x-1"
            >
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2">
            {transactions.map((tx, index) => {
              const txType = getTransactionType(tx);

              return (
                <div
                  key={tx.signature + index}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-green-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            txType === "Receive"
                              ? "bg-green-500/20 text-green-400"
                              : txType === "Send"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {txType}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(tx.timestamp)}
                        </span>
                        {tx.err && (
                          <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs">
                            Failed
                          </span>
                        )}
                      </div>

                      <p className="font-mono text-xs text-gray-400">
                        {formatAddress(tx.signature, 12)}
                      </p>
                    </div>

                    <a
                      href={getExplorerUrl(tx.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-green-500/20 transition-all group"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!walletData && !loading && (
        <div className="p-12 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-center">
          <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Track Any Wallet
          </h3>
          <p className="text-gray-400 text-sm">
            Enter a Solana wallet address to view balance, tokens, and
            transaction history
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletTracker;
