/**
 * Root layout (Server Component).
 *
 * Acuan PRD: Bab 3.1 (layout.tsx berisi Navbar dan Footer), Bab 3.3 (Server
 * Component sebagai default), Bab 5.1 (font Inter + Oswald), dan Bab 5.3
 * (navigasi sticky, mobile-first).
 */
import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { t } from "@/content/microcopy";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { ThemeSync } from "@/components/layout/ThemeSync";
import "./globals.css";

// Inter: teks umum. latin-ext dipakai karena nama pemain memuat huruf seperti
// ø, đ, ł (docs/design-tokens.md bagian 6.2). Variable font: tanpa opsi weight.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

// Oswald: angka besar (skor, statistik hero).
const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: {
    default: t("page.home.title"),
    // Judul halaman di microcopy sudah memuat akhiran "| Piala Dunia FIFA 2026",
    // jadi template tidak menambah apa pun agar akhiran tidak ganda.
    template: "%s",
  },
  description: t("page.home.meta"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: ThemeScript menambah class "dark" pada <html>
    // sebelum React melakukan hydration.
    <html
      lang="id"
      className={`${inter.variable} ${oswald.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col bg-canvas font-sans text-fg antialiased">
        <ThemeSync />
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 focus:outline-none md:px-6 lg:px-8"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
