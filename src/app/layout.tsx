import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
