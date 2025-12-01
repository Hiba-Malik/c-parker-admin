'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ADMIN_ADDRESS } from '@/config/contracts';
import Header from '@/components/dashboard/Header';
import AnnouncementManager from '@/components/dashboard/AnnouncementManager';
import ContractFunctions from '@/components/dashboard/ContractFunctions';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'announcements' | 'contracts'>('announcements');

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS?.toLowerCase();
    if (!isAdmin) {
      router.push('/');
    }
  }, [isConnected, address, router]);

  if (!isConnected || address?.toLowerCase() !== ADMIN_ADDRESS?.toLowerCase()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header address={address} />
      
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'announcements'
                ? 'gradient-button text-white'
                : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'contracts'
                ? 'gradient-button text-white'
                : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
            }`}
          >
            Contract Functions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'announcements' && <AnnouncementManager />}
        {activeTab === 'contracts' && <ContractFunctions />}
      </div>
    </div>
  );
}



