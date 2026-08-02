import "./globals.css";
import { Space_Grotesk, JetBrains_Mono, Cairo } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
// Arabic fallback per brand-system (AA Aniq is Nahlaa's licensed font, not
// available in this project) — Cairo is the documented fallback.
const arabic = Cairo({ subsets: ["arabic", "latin"], variable: "--font-arabic" });

export const metadata = {
  title: "Ramz — QR codes for every product on your Salla store",
  description:
    "Ramz auto-generates a scannable QR code for every product in your Salla store, kept in sync with your catalog. Bulk export, scan tracking, and branded styling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${arabic.variable}`}>
      <body className="bg-paper font-display text-ink">{children}</body>
    </html>
  );
}
