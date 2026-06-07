import { Noto_Sans_JP } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "古文書転写 読取評価 | 独立評価（盲検）",
  description:
    "中世写本転写テキストの独立評価。専門知識不要・約15分から参加できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>{children}</body>
    </html>
  );
}
