import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { OneChainProviderWrapper } from "@/components/providers/onechain-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "AnimeVault - Tokenize Your Anime Collection",
  description: "The premier platform for tokenizing and trading anime merchandise as NFTs",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <OneChainProviderWrapper>
          <Header />
          <main>{children}</main>
          <Toaster />
        </OneChainProviderWrapper>
      </body>
    </html>
  )
}
