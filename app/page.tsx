'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ADMIN_ADDRESS } from '@/config/contracts';
import toast from 'react-hot-toast';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      const isAdmin = address.toLowerCase() === ADMIN_ADDRESS?.toLowerCase();
      
      if (isAdmin) {
        toast.success('Admin wallet connected!');
        router.push('/dashboard');
      } else {
        toast.error('Please connect with the admin wallet');
        disconnect();
      }
    }
  }, [isConnected, address, router, disconnect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">C-Parker Admin Portal</h1>
          <p className="text-gray-400">Connect your admin wallet to continue</p>
        </div>

        <div className="gradient-border bg-[#1a1a2e] rounded-lg p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-border-to flex items-center justify-center mb-4">
              <Wallet className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2">
              Connect Wallet
            </h2>

            <p className="text-gray-400 text-sm text-center mb-6">
              Only the admin wallet can access this portal
            </p>

            <button
              onClick={() => open()}
              className="w-full connect-wallet-button text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Connect Wallet
            </button>

            <p className="text-xs text-gray-500 text-center">
              Supports MetaMask, WalletConnect, and 300+ wallets
            </p>

            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>Admin Address:</p>
              <p className="font-mono break-all">{ADMIN_ADDRESS}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

