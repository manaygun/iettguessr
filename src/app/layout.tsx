import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IETT Guessr | Tahmin Oyunu",
  description: "İstanbul ulaşım istatistiklerine bakarak hangi ilçede yaşandığını tahmin et! Viral #IstanbulWrapped tarzı eğlenceli tahmin oyunu.",
  keywords: ["istanbul", "ulaşım", "metrobüs", "metro", "vapur", "tahmin oyunu", "wrapped"],
  authors: [{ name: "IETT Guessr" }],
  openGraph: {
    title: "IETT Guessr",
    description: "İstanbul ulaşım istatistiklerine bakarak hangi ilçede yaşandığını tahmin et!",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "IETT Guessr",
    description: "İstanbul ulaşım istatistiklerine bakarak hangi ilçede yaşandığını tahmin et! 🚇🚌⛴️",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4986993922938185" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4986993922938185"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
