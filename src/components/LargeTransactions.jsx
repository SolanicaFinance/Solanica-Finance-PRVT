import React, { useState, useEffect } from "react";
import {
  Activity,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Zap,
} from "lucide-react";
import { formatAddress, formatTimestamp } from "../utils/solanaService";
import {
  getLargeSOLTransfers,
  monitorHighVolumeWallets,
} from "../utils/AlchemyService";
import { API_CONFIG } from "../utils/apiConfig";

const LargeTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(API_CONFIG.largeTransferThreshold);
  const [monitorMode, setMonitorMode] = useState("recent"); // 'recent' or 'wallets'
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;

      if (monitorMode === "wallets") {
        // Monitor specific high-volume wallets
        data = await monitorHighVolumeWallets(threshold);
      } else {
        // Get recent large transfers from recent blocks
        data = await getLargeSOLTransfers(threshold, 20);
      }

      setTransactions(data);

      if (data.length === 0) {
        setError(
          `No transactions over ${threshold} SOL found in recent blocks. Try lowering the threshold or check back later.`
        );
      }
    } catch (err) {
      console.error("Error fetching large transactions:", err);
      setError(
        "Failed to fetch transactions. Please check your Alchemy API key and network settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, [threshold, monitorMode]);

  const getExplorerUrl = (signature) => {
    const network = API_CONFIG.network === "mainnet" ? "" : "?cluster=devnet";
    return `https://solscan.io/tx/${signature}${network}`;
  };

  return (
    <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-white">
              Large Wallet Movements
            </h2>
          </div>
          <button
            onClick={fetchTransactions}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-400 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Monitor Mode */}
          <div className="flex items-center space-x-2 p-1 rounded-lg bg-white/5 border border-white/10">
            <button
              onClick={() => setMonitorMode("recent")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                monitorMode === "recent"
                  ? "bg-green-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Recent Blocks</span>
              </span>
            </button>
            <button
              onClick={() => setMonitorMode("wallets")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                monitorMode === "wallets"
                  ? "bg-green-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center space-x-1">
                <Activity className="w-3 h-3" />
                <span>High-Volume Wallets</span>
              </span>
            </button>
          </div>

          {/* Threshold Selector */}
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
          >
            <option value={10}>10+ SOL</option>
            <option value={50}>50+ SOL</option>
            <option value={100}>100+ SOL</option>
            <option value={500}>500+ SOL</option>
            <option value={1000}>1000+ SOL</option>
          </select>
        </div>

        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Using Alchemy Enhanced APIs</p>
            <p className="text-blue-300/80">
              {monitorMode === "recent"
                ? "Scanning recent blocks for large transfers. Mainnet recommended for best results."
                : "Monitoring known high-volume exchange wallets for large movements."}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && !loading && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-3">
          <RefreshCw className="w-8 h-8 text-green-500 animate-spin" />
          <p className="text-gray-400 text-sm">
            Scanning blockchain with Alchemy...
          </p>
        </div>
      ) : (
        <>
          {/* Transactions List */}
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <div
                  key={tx.signature + index}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-green-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-semibold">
                          {tx.amount.toFixed(2)} SOL
                        </span>
                        {tx.type && (
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-semibold ${
                              tx.type === "receive"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-orange-500/20 text-orange-400"
                            }`}
                          >
                            {tx.type.toUpperCase()}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(tx.timestamp)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {tx.from && tx.from !== "Unknown" && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-400">From:</span>
                            <span className="font-mono text-white">
                              {formatAddress(tx.from, 6)}
                            </span>
                          </div>
                        )}

                        {tx.to && tx.to !== "Unknown" && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-400">To:</span>
                            <span className="font-mono text-white">
                              {formatAddress(tx.to, 6)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <span>Slot: {tx.slot}</span>
                      </div>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No large transactions found</p>
              <p className="text-sm text-gray-500 mt-1">
                {monitorMode === "recent"
                  ? `Try lowering the threshold or check back in a moment. Recent blocks are scanned every 30 seconds.`
                  : `No recent activity from monitored wallets over ${threshold} SOL.`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LargeTransactions;
