import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vesting Scheduler - Decentralized Token Vesting on Base",
  description: "100% decentralized token vesting platform on Base Network. Verified contract, ownership renounced. Create customizable vesting schedules with cliff periods for teams, investors, and contributors.",
  keywords: ["vesting", "token vesting", "Base", "Base Network", "DeFi", "cryptocurrency", "smart contracts", "decentralized", "verified contract"],
  authors: [{ name: "Vesting Scheduler" }],
  creator: "Vesting Scheduler",
  publisher: "Vesting Scheduler",
  metadataBase: new URL('https://baseapp4-m6r50vtoi-xabiers-projects-c5a11aae.vercel.app'),
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
    title: "Vesting Scheduler - Decentralized Token Vesting",
    description: "Create and manage token vesting schedules on Base Network. 100% decentralized and verified.",
    url: 'https://baseapp4-m6r50vtoi-xabiers-projects-c5a11aae.vercel.app',
    siteName: 'Vesting Scheduler',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vesting Scheduler - Token Vesting on Base Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vesting Scheduler - Base Network',
    description: 'Decentralized token vesting platform. Verified contract, ownership renounced.',
    images: ['/og-image.png'],
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
