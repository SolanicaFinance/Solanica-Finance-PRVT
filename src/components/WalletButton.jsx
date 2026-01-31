import React, { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Wallet } from "lucide-react";
import theme from "../theme";

const WalletButton = ({ isMobile = false }) => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (connected && publicKey) {
      // Fetch wallet balance
      const getBalance = async () => {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
      getBalance();

      // Update balance every 30 seconds
      const interval = setInterval(getBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [connected, publicKey, connection]);

  if (isMobile) {
    return (
      <div className="w-full">
        {connected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Wallet Balance</p>
                  <p className="text-2xl font-bold text-white">
                    {balance.toFixed(4)} SOL
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Wallet Address</p>
              <p className="text-sm text-white font-mono break-all">
                {publicKey?.toBase58()}
              </p>
            </div>

            <WalletMultiButton className="!w-full !bg-gradient-to-r !from-green-500 !to-green-600 !rounded-xl !h-12" />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <Wallet className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">
              Connect Your Wallet
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Connect your Solana wallet to get started
            </p>
            <WalletMultiButton className="!w-full !bg-gradient-to-r !from-green-500 !to-green-600 !rounded-xl !h-12" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {connected && (
        <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <Wallet className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-white">
            {balance.toFixed(4)} SOL
          </span>
        </div>
      )}
      <WalletMultiButton className="!bg-gradient-to-r !from-green-500 !to-green-600 !rounded-xl !h-10" />
    </div>
  );
};

export default WalletButton;
