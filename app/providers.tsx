'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { http } from 'wagmi';

import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

// Custom RPC endpoint with OnchainKit API key for better rate limits
const baseWithCustomRpc = {
  ...base,
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_BASE_RPC_URL ||
        `https://api.developer.coinbase.com/rpc/v1/base/${process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}`
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_BASE_RPC_URL ||
        `https://api.developer.coinbase.com/rpc/v1/base/${process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}`
      ],
    },
  },
} as const;

const wagmiConfig = getDefaultConfig({
  appName: 'Vesting Scheduler',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [baseWithCustomRpc as any],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseWithCustomRpc as any}
        >
          <RainbowKitProvider modalSize="compact" locale="en-US">
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
