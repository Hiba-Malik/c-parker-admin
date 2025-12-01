'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config } from '@/config/wagmi';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#4B158E',
    '--w3m-border-radius-master': '8px',
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#200F46',
              color: '#fff',
              border: '1px solid #4B158E',
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

