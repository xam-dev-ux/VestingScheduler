import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vesting Scheduler - Token Vesting Made Simple on Base",
  description:
    "Create customizable token vesting schedules on Base Network. 100% decentralized with verified contracts. Gas-free with Coinbase Smart Wallet.",
  metadataBase: new URL("https://baseapp4.vercel.app"),

  icons: {
    icon: [
      { url: "/icon.png", sizes: "1024x1024", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "1024x1024", type: "image/png" },
    ],
  },

  openGraph: {
    title: "Vesting Scheduler - Token Vesting Made Simple on Base",
    description:
      "Create customizable token vesting schedules on Base Network. Decentralized with verified contracts.",
    url: "https://baseapp4.vercel.app",
    siteName: "Vesting Scheduler",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://baseapp4.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vesting Scheduler on Base",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Vesting Scheduler - Token Vesting on Base",
    description:
      "Create customizable token vesting schedules. Gas-free with Coinbase Smart Wallet.",
    images: ["https://baseapp4.vercel.app/og-image.png"],
  },

  other: {
    /**
     * REQUIRED Base / Farcaster Mini App Embed
     * This is what fixes:
     * "Head section of your page misses embed meta tag"
     */
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://baseapp4.vercel.app/hero.png",
      button: {
        title: "Open App",
        action: {
          type: "launch_frame",
          url: "https://baseapp4.vercel.app",
          name: "Vesting Scheduler",
          splashImageUrl: "https://baseapp4.vercel.app/splash.png",
          splashBackgroundColor: "#3b82f6",
        },
      },
    }),

    /**
     * Base App verification
     */
    "base:app_id": "696227b8b8395f034ac2217a",
  },

  robots: {
    index: true,
    follow: true,
  },

  applicationName: "Vesting Scheduler",
  category: "finance",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
