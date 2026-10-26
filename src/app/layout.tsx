import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexiPact | AI-Audited Legal Escrow & EIP-712 Agreement Protocol",
  description:
    "Decentralized legal agreement infrastructure with EIP-712 cryptographic signatures, Base Sepolia smart contract milestone escrow, and autonomous AI compliance verification.",
  openGraph: {
    title: "LexiPact | Autonomous Web3 Legal Escrow",
    description:
      "Bridge digital legal contracts with Base Sepolia smart contract escrow and autonomous AI deliverable compliance audits.",
    url: "https://lexipact.vercel.app",
    siteName: "LexiPact",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-lexi-bg text-lexi-parchment antialiased selection:bg-lexi-gold/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
