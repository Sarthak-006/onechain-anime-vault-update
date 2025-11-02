"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Wallet,
  User,
  Menu,
  X,
  Sparkles,
  Home,
  ShoppingBag,
  LayoutDashboard,
  Plus,
  LogOut,
  Settings,
  Copy,
  ExternalLink,
  Bell,
  TrendingUp,
} from "lucide-react"
import { useOneWallet, shortenAddress } from "@/lib/wallet"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
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
        variant: "destructive",
      })
    }
  }, [connectWallet, toast])

  const onDisconnect = useCallback(() => {
    try {
      disconnectWallet()
      toast({ title: "Wallet disconnected", description: "You have been disconnected successfully" })
      setIsMenuOpen(false)
    } catch (err: any) {
      console.error("Disconnect error:", err)
    }
  }, [disconnectWallet, toast])

  const copyAddress = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      })
    }
  }, [address, toast])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
    { href: "/create", icon: Plus, label: "Create" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-primary/5">
      {/* Gradient Top Bar */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-75 blur-sm group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/50">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              AnimeVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl bg-muted/50 p-1.5 backdrop-blur-sm border border-border/50 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/50 scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-transform ${active ? "scale-110" : ""}`} />
                    <span className="hidden xl:block">{item.label}</span>
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-white/80" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search anime NFTs, series, characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            {isConnected && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex relative rounded-xl hover:bg-muted/80 transition-all"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
              </Button>
            )}

            {/* Wallet Connection / User Menu */}
            {isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-3 rounded-xl px-4 py-2.5 h-auto hover:bg-muted/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-75 blur group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="text-xs text-muted-foreground">Connected</div>
                        <div className="text-sm font-semibold text-foreground">{shortenAddress(address)}</div>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl">
                  <DropdownMenuLabel className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                          {address?.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{shortenAddress(address)}</div>
                        <div className="text-xs text-muted-foreground">OneChain Wallet</div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="rounded-lg" onClick={copyAddress}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg" asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg" asChild>
                    <Link href="/dashboard">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem
                    className="rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                    onClick={onDisconnect}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={onConnect}
                disabled={isConnecting}
                className="hidden md:flex items-center gap-2 rounded-xl px-6 py-2.5 h-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? (
                  <>
                    <span className="animate-pulse">Connecting...</span>
                  </>
                ) : (
                  <span>Connect Wallet</span>
                )}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl hover:bg-muted/80"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search anime NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Wallet Actions */}
            {isConnected && address ? (
              <div className="space-y-2 pt-4 border-t border-border/40">
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{shortenAddress(address)}</div>
                    <div className="text-xs text-muted-foreground">OneChain Wallet</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={copyAddress}
                  className="w-full rounded-xl"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button
                  variant="destructive"
                  onClick={onDisconnect}
                  className="w-full rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t border-border/40">
                <Button
                  onClick={onConnect}
                  disabled={isConnecting}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
