import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thefix.example.com"),
  title: {
    default: "The Fix | Fast Device Repairs & Accessories",
    template: "%s | The Fix",
  },
  description:
    "The Fix is your neighborhood mobile device repair shop for phones, tablets, laptops, and game consoles. Book same-day repairs, browse accessories, and get expert support.",
  openGraph: {
    title: "The Fix | Fast Device Repairs & Accessories",
    description:
      "Book same-day repairs, browse curated accessories, and connect with expert support at The Fix.",
    url: "https://thefix.example.com",
    siteName: "The Fix",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "The Fix storefront collage",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fix | Fast Device Repairs & Accessories",
    description:
      "Same-day tech repairs, curated accessories, and knowledgeable support at The Fix.",
    images: ["/og-default.png"],
  },
  keywords: [
    "phone repair",
    "tablet repair",
    "laptop repair",
    "electronics accessories",
    "The Fix",
    "mobile repair shop",
  ],
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}



