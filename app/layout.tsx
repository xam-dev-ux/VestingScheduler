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
  openGraph: {
    title: "Vesting Scheduler - Decentralized Token Vesting",
    description: "Create and manage token vesting schedules on Base Network. 100% decentralized and verified.",
    url: 'https://baseapp4-m6r50vtoi-xabiers-projects-c5a11aae.vercel.app',
    siteName: 'Vesting Scheduler',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vesting Scheduler - Base Network',
    description: 'Decentralized token vesting platform. Verified contract, ownership renounced.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
  },
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
