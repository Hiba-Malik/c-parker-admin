import { defaultWagmiConfig } from '@web3modal/wagmi';
import { polygonAmoy } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const metadata = {
  name: 'C-Parker Admin Portal',
  description: 'Admin dashboard for CCT Matrix Platform',
  url: 'https://cct-admin.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

export const config = defaultWagmiConfig({
  chains: [polygonAmoy],
  projectId,
  metadata,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

