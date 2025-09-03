import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Wallet } from "lucide-react"
import Link from "next/link"
import { WalletInfo } from "@/components/wallet/wallet-info"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4">
              Powered by OneChain OCT Testnet
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Connect Your
              <span className="text-primary block">OneWallet</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Connect your OneWallet to view your OCT Testnet token balance and start using the anime NFT platform.
            </p>
          </div>
        </div>
      </section>

      {/* Wallet Connection Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">OneWallet Integration</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your OneWallet to view your OCT Testnet token balance
            </p>
          </div>

          <div className="flex justify-center">
            <WalletInfo />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container px-4 mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AnimeVault</span>
          </div>
          <p className="text-muted-foreground">
            Powered by OneChain OCT Testnet
          </p>
        </div>
      </footer>
    </div>
  )
}


