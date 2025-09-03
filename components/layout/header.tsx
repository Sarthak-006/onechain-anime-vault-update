"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Wallet, User, Menu, X, Sparkles } from "lucide-react"
import { useOneWallet, shortenAddress } from "@/lib/wallet"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast()

  // Use the OneWallet hook (MetaMask-like experience)
  const {
    address,
    connectWallet,
    disconnectWallet,
    isConnecting,
    isConnected,
    oneWallet
  } = useOneWallet()

  const onConnect = useCallback(async () => {
    try {
      connectWallet()
      toast({
        title: "Connecting to OneWallet...",
        description: "Please approve the connection in your wallet",
      })
    } catch (err: any) {
      console.error("Connect error:", err)
      toast({
        title: "OneWallet required",
        description:
          "Install OneWallet: https://chromewebstore.google.com/detail/onechain-wallet/gclmcgmpkgblaglfokkaclneihpnbkli",
      })
    }
  }, [connectWallet, toast])

  const onDisconnect = useCallback(() => {
    try {
      disconnectWallet()
      toast({ title: "Wallet disconnected" })
    } catch (err: any) {
      console.error("Disconnect error:", err)
    }
  }, [disconnectWallet, toast])

  const onDebug = useCallback(() => {
    console.log("OneWallet Debug Info:", {
      oneWallet,
      isConnected,
      address,
      isConnecting,
      availableWallets: oneWallet ? [oneWallet] : []
    })
    toast({
      title: "Debug info logged",
      description: "Check browser console for OneWallet details",
    })
  }, [oneWallet, isConnected, address, isConnecting, toast])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">AnimeVault</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link href="/create" className="text-sm font-medium hover:text-primary transition-colors">
            Tokenize
          </Link>
          <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors">
            Collections
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search anime NFTs..." className="pl-10" />
          </div>
        </div>

        {/* Wallet & User Actions */}
        <div className="flex items-center space-x-2">
          {isConnected && address ? (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={onDisconnect}>
                <Wallet className="h-4 w-4 mr-2" />
                {shortenAddress(address)}
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                onClick={onConnect}
                disabled={isConnecting}
                className="hidden md:flex"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
              <Button onClick={onDebug} variant="outline" size="sm" className="hidden md:flex">
                Debug
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search anime NFTs..." className="pl-10" />
            </div>

            <nav className="flex flex-col space-y-2">
              <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors py-2">
                Marketplace
              </Link>
              <Link href="/create" className="text-sm font-medium hover:text-primary transition-colors py-2">
                Tokenize
              </Link>
              <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors py-2">
                Collections
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors py-2">
                Dashboard
              </Link>
            </nav>

            {!isConnected && (
              <div className="space-y-2">
                <Button
                  onClick={onConnect}
                  disabled={isConnecting}
                  className="w-full"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
                <Button onClick={onDebug} variant="outline" className="w-full">
                  Debug Wallet
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
