import "./globals.css";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Ramz — QR codes for every product on your Salla store",
  description:
    "Ramz auto-generates a scannable QR code for every product in your Salla store, kept in sync with your catalog. Bulk export, scan tracking, and branded styling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-paper font-display text-ink">{children}</body>
    </html>
  );
}
