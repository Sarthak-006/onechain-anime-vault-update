"use client"

import { useOneWallet } from "@/lib/wallet"
import { useSuiClient } from "@onelabs/dapp-kit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

export function WalletInfo() {
    const { address, isConnected, isConnecting, connectWallet, disconnectWallet } = useOneWallet()
    const { toast } = useToast()
    const client = useSuiClient()
    const [balance, setBalance] = useState<string>("0")
    const [isLoadingBalance, setIsLoadingBalance] = useState(false)

    // Fetch OCT balance when wallet connects
    useEffect(() => {
        const fetchBalance = async () => {
            if (!address || !client) return

            setIsLoadingBalance(true)
            try {
                // Try to get OCT coins first
                let coins = await client.getCoins({
                    owner: address,
                    coinType: "0x2::oct::OCT",
                })

                // If no OCT coins, try SUI coin type as fallback
                if (coins.data.length === 0) {
                    coins = await client.getCoins({
                        owner: address,
                        coinType: "0x2::sui::SUI",
                    })
                }

                // If still no coins, try without coinType
                if (coins.data.length === 0) {
                    coins = await client.getCoins({
                        owner: address,
                    })
                }

                if (coins.data.length > 0) {
                    // Calculate total balance in OCT (convert from MIST)
                    const totalBalance = coins.data.reduce((sum, coin) => {
                        return sum + parseInt(coin.balance)
                    }, 0)

                    const balanceInOCT = (totalBalance / 1_000_000_000).toFixed(4)
                    setBalance(balanceInOCT)
                } else {
                    setBalance("0")
                }
            } catch (error) {
                console.error("Error fetching balance:", error)
                setBalance("0")
            } finally {
                setIsLoadingBalance(false)
            }
        }

        fetchBalance()
    }, [address, client])

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address)
            toast({
                title: "Address copied!",
                description: "Wallet address copied to clipboard",
            })
        }
    }

    if (!isConnected) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Connect Your Wallet
                    </CardTitle>
                    <CardDescription>
                        Connect your OneWallet to start using the anime NFT platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="w-full"
                    >
                        {isConnecting ? "Connecting..." : "Connect OneWallet"}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Connected
                </CardTitle>
                <CardDescription>
                    Your OneWallet is connected and ready to use
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Badge variant="default" className="bg-green-500">
                            Connected
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-medium">OCT Balance</span>
                        <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-md">
                            <Coins className="h-4 w-4 text-primary" />
                            <span className="text-lg font-bold text-primary">
                                {isLoadingBalance ? "Loading..." : `${balance} OCT`}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-medium">Address</span>
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <code className="text-xs flex-1">{address}</code>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyAddress}
                                className="h-6 w-6 p-0"
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://onescan.cc/testnet/account?address=${address}`, '_blank')}
                        className="flex-1"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={disconnectWallet}
                        className="flex-1"
                    >
                        Disconnect
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
