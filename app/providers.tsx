'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider, getDefaultWallets, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { WagmiProvider, createConfig } from 'wagmi';
import { http } from 'wagmi';
import { useState, useEffect } from 'react';
import { Attribution } from 'ox/erc8021';

import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetching on focus in mini-apps
    },
  },
});

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

// Builder Code for attribution - get from base.dev > Settings > Builder Code
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ['bc_cqc42brh'],
});

// Get default wallet connectors
const { connectors } = getDefaultWallets({
  appName: 'Vesting Scheduler',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
});

const wagmiConfig = createConfig({
  chains: [baseWithCustomRpc as any],
  connectors,
  transports: {
    [baseWithCustomRpc.id]: http(),
  },
  dataSuffix: DATA_SUFFIX,
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Detect if running in iframe/mini-app context
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      // If we can't access window.top due to cross-origin, we're likely in an iframe
      setIsInIframe(true);
    }
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseWithCustomRpc as any}
        >
          <RainbowKitProvider
            modalSize="compact"
            locale="en-US"
            showRecentTransactions={!isInIframe} // Disable in mini-apps to prevent notification loops
            appInfo={{
              appName: 'Vesting Scheduler',
              disclaimer: undefined, // Disable disclaimer in mini-apps
            }}
          >
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
