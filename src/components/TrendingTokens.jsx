import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import {
  getTopSolanaTokens,
  formatPrice,
  formatChange,
  formatLargeNumber,
} from "../utils/coingeckoService";

const TrendingTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopSolanaTokens(15);
      setTokens(data);
    } catch (err) {
      setError("Failed to fetch trending tokens");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTokens, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading && tokens.length === 0) {
    return (
      <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-green-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-bold text-white">
            Trending Solana Tokens
          </h2>
        </div>
        <button
          onClick={fetchTokens}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Tokens List */}
      <div className="space-y-3">
        {tokens.map((token, index) => {
          const change = formatChange(token.price_change_percentage_24h || 0);

          return (
            <div
              key={token.id}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-green-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                {/* Token Info */}
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-gray-500 font-mono text-sm w-6">
                    #{index + 1}
                  </span>

                  {token.image && (
                    <img
                      src={token.image}
                      alt={token.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-white">{token.name}</p>
                      <span className="text-xs text-gray-500 uppercase">
                        {token.symbol}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      MCap: {formatLargeNumber(token.market_cap || 0)}
                    </p>
                  </div>
                </div>

                {/* Price & Change */}
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {formatPrice(token.current_price || 0)}
                  </p>
                  <div
                    className={`flex items-center justify-end space-x-1 text-sm ${
                      change.isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {change.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{change.value}</span>
                  </div>
                </div>
              </div>

              {/* Sparkline (if available) */}
              {token.sparkline_in_7d?.price && (
                <div className="mt-2">
                  <svg width="100%" height="40" className="opacity-50">
                    <polyline
                      fill="none"
                      stroke={change.isPositive ? "#00ff88" : "#ff4444"}
                      strokeWidth="2"
                      points={token.sparkline_in_7d.price
                        .map((price, i) => {
                          const x =
                            (i / token.sparkline_in_7d.price.length) * 100;
                          const y =
                            40 -
                            ((price -
                              Math.min(...token.sparkline_in_7d.price)) /
                              (Math.max(...token.sparkline_in_7d.price) -
                                Math.min(...token.sparkline_in_7d.price))) *
                              30;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingTokens;
