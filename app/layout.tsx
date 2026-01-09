import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vesting Scheduler - Token Vesting Made Simple on Base",
  description: "Create customizable token vesting schedules on Base Network. 100% decentralized with verified contracts. Gas-free with Coinbase Smart Wallet.",
  keywords: ["vesting", "token vesting", "Base", "Base Network", "DeFi", "cryptocurrency", "smart contracts", "decentralized", "verified contract", "payroll", "team tokens", "investor vesting"],
  authors: [{ name: "Vesting Scheduler" }],
  creator: "Vesting Scheduler",
  publisher: "Vesting Scheduler",
  metadataBase: new URL('https://baseapp4.vercel.app'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '1024x1024', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', sizes: '1024x1024', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Vesting Scheduler - Token Vesting Made Simple on Base",
    description: "Create customizable token vesting schedules on Base Network. 100% decentralized with verified contracts. Gas-free with Coinbase Smart Wallet.",
    url: 'https://baseapp4.vercel.app',
    siteName: 'Vesting Scheduler',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://baseapp4.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vesting Scheduler - Token Vesting on Base Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vesting Scheduler - Token Vesting on Base',
    description: 'Create customizable token vesting schedules. Gas-free with Coinbase Smart Wallet.',
    images: ['https://baseapp4.vercel.app/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://baseapp4.vercel.app/og-image.png',
    'fc:frame:button:1': 'Open App',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://baseapp4.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vesting Scheduler',
  },
  applicationName: 'Vesting Scheduler',
  category: 'finance',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
