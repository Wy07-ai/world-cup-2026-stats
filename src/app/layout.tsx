import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Statistik Piala Dunia FIFA 2026",
  description: "Platform statistik interaktif Piala Dunia FIFA 2026",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
