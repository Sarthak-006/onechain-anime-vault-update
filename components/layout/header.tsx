"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useOneWallet, shortenAddress } from "@/lib/wallet"
import { Button } from "@/components/ui/button"
import { Wallet, Home, Store, Plus, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const { address, isConnected, connectWallet } = useOneWallet()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Create", href: "/create", icon: Plus },
    { name: "Dashboard", href: "/dashboard", icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="text-2xl font-black">
            <span className="bg-gradient-to-r from-teal-500 via-purple-500 bg-clip-text text-transparent">Anime</span>
            <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">Vault</span>
          </div>
        </Link>

        {/* Navigation - Centered with pill container */}
        <nav className="hidden md:flex items-center gap-1 mx-auto bg-muted/50 px-2 py-1.5 rounded-full border border-border/50">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Wallet Button */}
        <div className="flex items-center gap-2">
          {isConnected && address ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 font-mono text-sm"
            >
              <Wallet className="h-4 w-4" />
              {shortenAddress(address, 4)}
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={connectWallet}
              className="gap-2"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
