'use client';

import { useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface HeaderProps {
  address: string;
}

export default function Header({ address }: HeaderProps) {
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const handleDisconnect = () => {
    disconnect();
    toast.success('Disconnected successfully');
    router.push('/');
  };

  return (
    <header className="border-b border-primary/20 bg-[#1a1a2e]">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-border-to flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Admin</h2>
              <p className="text-gray-400 text-sm font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="flex items-center space-x-2 gradient-button px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </header>
  );
}



