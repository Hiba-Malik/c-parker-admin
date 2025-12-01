'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useReadContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { ORBIT_A_ADDRESS, ORBIT_B_ADDRESS, ORBIT_A_ABI, ORBIT_B_ABI } from '@/config/contracts';
import toast from 'react-hot-toast';
import { Settings, Wallet as WalletIcon } from 'lucide-react';
import { parseEther, formatEther } from 'viem';

export default function ContractFunctions() {
  const { address } = useAccount();
  const [activeContract, setActiveContract] = useState<'orbitA' | 'orbitB'>('orbitA');
  const [level, setLevel] = useState<string>('1');
  const [newPriceUSD, setNewPriceUSD] = useState<string>('');
  const [newPoolWallet, setNewPoolWallet] = useState<string>('');

  const contractAddress = activeContract === 'orbitA' ? ORBIT_A_ADDRESS : ORBIT_B_ADDRESS;
  const contractABI = activeContract === 'orbitA' ? ORBIT_A_ABI : ORBIT_B_ABI;

  // Read current pool wallet
  const { data: currentPoolWallet, refetch: refetchPoolWallet } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'poolWallet',
  });

  // Read current level price
  const { data: currentLevelPrice, refetch: refetchLevelPrice } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'levelPriceUSD',
    args: [BigInt(level || '1')],
  });

  // Write contract hooks
  const { 
    writeContract: writePriceUpdate, 
    data: priceUpdateHash,
    isPending: isPriceUpdatePending 
  } = useWriteContract();

  const { 
    writeContract: writePoolWalletUpdate,
    data: poolWalletHash,
    isPending: isPoolWalletPending 
  } = useWriteContract();

  // Wait for transactions
  const { isLoading: isPriceUpdateLoading, isSuccess: isPriceUpdateSuccess } = 
    useWaitForTransactionReceipt({ hash: priceUpdateHash });

  const { isLoading: isPoolWalletLoading, isSuccess: isPoolWalletSuccess } = 
    useWaitForTransactionReceipt({ hash: poolWalletHash });

  useEffect(() => {
    if (isPriceUpdateSuccess) {
      toast.success('Price updated successfully!');
      setNewPriceUSD('');
      // Reload the current price
      refetchLevelPrice();
    }
  }, [isPriceUpdateSuccess, refetchLevelPrice]);

  useEffect(() => {
    if (isPoolWalletSuccess) {
      toast.success('Pool wallet updated successfully!');
      setNewPoolWallet('');
      // Reload the current pool wallet
      refetchPoolWallet();
    }
  }, [isPoolWalletSuccess, refetchPoolWallet]);

  // Refetch price when level or contract changes
  useEffect(() => {
    refetchLevelPrice();
  }, [level, activeContract, refetchLevelPrice]);

  // Refetch pool wallet when contract changes
  useEffect(() => {
    refetchPoolWallet();
  }, [activeContract, refetchPoolWallet]);

  const handleSetLevelPrice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPriceUSD || parseFloat(newPriceUSD) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      const priceInWei = parseEther(newPriceUSD);
      
      writePriceUpdate({
        address: contractAddress,
        abi: contractABI,
        functionName: 'setLevelPriceUSD',
        args: [BigInt(level), priceInWei],
      });

      toast.loading('Transaction submitted...', { duration: 2000 });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update price');
    }
  };

  const handleUpdatePoolWallet = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPoolWallet || !/^0x[a-fA-F0-9]{40}$/.test(newPoolWallet)) {
      toast.error('Please enter a valid wallet address');
      return;
    }

    try {
      writePoolWalletUpdate({
        address: contractAddress,
        abi: contractABI,
        functionName: 'updatePoolWallet',
        args: [newPoolWallet as `0x${string}`],
      });

      toast.loading('Transaction submitted...', { duration: 2000 });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update pool wallet');
    }
  };

  return (
    <div className="space-y-6">
      {/* Contract Selector */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveContract('orbitA')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeContract === 'orbitA'
              ? 'gradient-button text-white'
              : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
          }`}
        >
          Orbit A
        </button>
        <button
          onClick={() => setActiveContract('orbitB')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeContract === 'orbitB'
              ? 'gradient-button text-white'
              : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
          }`}
        >
          Orbit B
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Set Level Price */}
        <div className="gradient-border bg-[#1a1a2e] rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-border-to flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Set Level Price (USD)</h3>
          </div>

          <form onSubmit={handleSetLevelPrice} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Level (1-10)</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
            </div>

            {currentLevelPrice && (
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-gray-400 text-sm">Current Price:</p>
                <p className="text-white font-mono text-lg">
                  ${formatEther(currentLevelPrice as bigint)} USD
                </p>
              </div>
            )}

            <div>
              <label className="block text-gray-400 mb-2">New Price (USD)</label>
              <input
                type="number"
                step="0.01"
                value={newPriceUSD}
                onChange={(e) => setNewPriceUSD(e.target.value)}
                placeholder="e.g., 10.00"
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPriceUpdatePending || isPriceUpdateLoading}
              className="w-full gradient-button px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPriceUpdatePending || isPriceUpdateLoading
                ? 'Processing...'
                : 'Update Price'}
            </button>
          </form>
        </div>

        {/* Update Pool Wallet */}
        <div className="gradient-border bg-[#1a1a2e] rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-border-to flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Update Pool Wallet</h3>
          </div>

          <form onSubmit={handleUpdatePoolWallet} className="space-y-4">
            {currentPoolWallet && (
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-gray-400 text-sm">Current Pool Wallet:</p>
                <p className="text-white font-mono text-sm break-all">
                  {currentPoolWallet as string}
                </p>
              </div>
            )}

            <div>
              <label className="block text-gray-400 mb-2">New Pool Wallet Address</label>
              <input
                type="text"
                value={newPoolWallet}
                onChange={(e) => setNewPoolWallet(e.target.value)}
                placeholder="0x..."
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPoolWalletPending || isPoolWalletLoading}
              className="w-full gradient-button px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPoolWalletPending || isPoolWalletLoading
                ? 'Processing...'
                : 'Update Pool Wallet'}
            </button>
          </form>
        </div>
      </div>

      {/* Contract Info */}
      <div className="gradient-border bg-[#1a1a2e] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Contract Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Active Contract:</span>
            <span className="text-white font-medium">
              {activeContract === 'orbitA' ? 'Orbit A' : 'Orbit B'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Contract Address:</span>
            <span className="text-white font-mono text-sm">
              {contractAddress?.slice(0, 6)}...{contractAddress?.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Admin Address:</span>
            <span className="text-white font-mono text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}



