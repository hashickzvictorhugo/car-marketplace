import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "AutoMax - Marketplace de Veículos",
    template: "%s | AutoMax",
  },
  description: "O maior marketplace de veículos do Brasil. Compre e venda carros novos e seminovos com segurança.",
  keywords: ["carros", "veículos", "automóveis", "marketplace", "comprar carro", "vender carro", "seminovos"],
  authors: [{ name: "AutoMax" }],
  creator: "AutoMax",
  publisher: "AutoMax",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://automax.com.br",
    siteName: "AutoMax",
    title: "AutoMax - Marketplace de Veículos",
    description: "O maior marketplace de veículos do Brasil. Compre e venda carros novos e seminovos com segurança.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoMax - Marketplace de Veículos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoMax - Marketplace de Veículos",
    description: "O maior marketplace de veículos do Brasil.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a5f" },
    { media: "(prefers-color-scheme: dark)", color: "#3b82f6" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{Providers({ children })}</body>
    </html>
  )
}