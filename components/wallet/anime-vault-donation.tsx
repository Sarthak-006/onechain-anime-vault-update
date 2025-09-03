"use client"

import { useOneWallet } from "@/lib/wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Heart, Star, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useSignAndExecuteTransaction, useSuiClient } from "@onelabs/dapp-kit"
import { Transaction } from "@onelabs/sui/transactions"

export function AnimeVaultDonation() {
    const { address, isConnected, connectWallet } = useOneWallet()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const client = useSuiClient()

    // Anime Vault Collection Address - your actual OneWallet address
    const animeVaultCollection = "0x0afb16edad0861f1c1d3238bee4a759a75aad531ed363ee692a30108d6c4c8a4"

    const handleDonate = async (amount: number) => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet first",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)

        try {
            // Convert OCT to MIST (1 OCT = 1,000,000,000 MIST)
            const amountInMist = Math.floor(amount * 1_000_000_000)

            // Get user's OCT coin objects - OneChain OCT token type
            let coins = await client.getCoins({
                owner: address!,
                coinType: "0x2::oct::OCT", // OneChain OCT token type
            })

            // If no OCT coins found, try SUI coin type as fallback
            if (coins.data.length === 0) {
                coins = await client.getCoins({
                    owner: address!,
                    coinType: "0x2::sui::SUI",
                })
            }

            // If still no coins, try without coinType to get all coins
            if (coins.data.length === 0) {
                coins = await client.getCoins({
                    owner: address!,
                })
            }

            if (coins.data.length === 0) {
                throw new Error("No OCT tokens found in wallet. Please use the faucet to get testnet tokens.")
            }

            const tx = new Transaction()
            const primaryCoin = coins.data[0].coinObjectId

            // If we need more than what's in the first coin, merge coins first
            if (coins.data[0].balance < amountInMist) {
                const coinObjects = coins.data.map(coin => tx.object(coin.coinObjectId))
                const mergedCoin = tx.mergeCoins(tx.object(primaryCoin), coinObjects.slice(1))
                const [coinToTransfer] = tx.splitCoins(mergedCoin, [amountInMist])
                tx.transferObjects([coinToTransfer], animeVaultCollection)
            } else {
                const [coinToTransfer] = tx.splitCoins(tx.object(primaryCoin), [amountInMist])
                tx.transferObjects([coinToTransfer], animeVaultCollection)
            }

            signAndExecuteTransaction(
                {
                    transaction: tx,
                },
                {
                    onSuccess: (result) => {
                        toast({
                            title: "Donation successful! 🎁",
                            description: `Thank you for supporting Anime Vault with ${amount} OCT!`,
                        })
                        console.log("Donation result:", result)
                    },
                    onError: (error) => {
                        toast({
                            title: "Donation failed",
                            description: error.message || "Please try again",
                            variant: "destructive"
                        })
                        console.error("Donation error:", error)
                    }
                }
            )

        } catch (error: any) {
            toast({
                title: "Donation failed",
                description: error.message || "Please try again",
                variant: "destructive"
            })
            console.error("Donation error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isConnected) {
        return (
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Heart className="h-6 w-6 text-red-500" />
                        Support Anime Vault
                    </CardTitle>
                    <CardDescription>
                        Connect your wallet to support the anime NFT collection
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={connectWallet} className="w-full">
                        Connect Wallet to Donate
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Heart className="h-6 w-6 text-red-500" />
                    Support Anime Vault
                </CardTitle>
                <CardDescription>
                    Help us grow the largest anime NFT collection on OneChain
                </CardDescription>
                <div className="text-xs text-muted-foreground text-center mt-2">
                    Donations go to: {animeVaultCollection.slice(0, 8)}...{animeVaultCollection.slice(-8)}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-primary">1,247</div>
                        <div className="text-xs text-muted-foreground">NFTs Created</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-primary">892</div>
                        <div className="text-xs text-muted-foreground">Collectors</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-primary">156.7</div>
                        <div className="text-xs text-muted-foreground">OCT Raised</div>
                    </div>
                </div>

                {/* Donation Options */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-center">Choose your donation amount:</div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleDonate(0.1)}
                            disabled={isLoading}
                            className="h-12 flex flex-col items-center gap-1"
                        >
                            <Gift className="h-4 w-4" />
                            <span className="font-bold">0.1 OCT</span>
                            <span className="text-xs text-muted-foreground">Small support</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleDonate(0.3)}
                            disabled={isLoading}
                            className="h-12 flex flex-col items-center gap-1 border-primary"
                        >
                            <Star className="h-4 w-4 text-primary" />
                            <span className="font-bold text-primary">0.3 OCT</span>
                            <span className="text-xs text-muted-foreground">Recommended</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleDonate(0.5)}
                            disabled={isLoading}
                            className="h-12 flex flex-col items-center gap-1"
                        >
                            <Heart className="h-4 w-4" />
                            <span className="font-bold">0.5 OCT</span>
                            <span className="text-xs text-muted-foreground">Big fan</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleDonate(1.0)}
                            disabled={isLoading}
                            className="h-12 flex flex-col items-center gap-1"
                        >
                            <Users className="h-4 w-4" />
                            <span className="font-bold">1.0 OCT</span>
                            <span className="text-xs text-muted-foreground">Super supporter</span>
                        </Button>
                    </div>
                </div>

                {/* Benefits */}
                <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Your donation helps:</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Create more anime NFT collections</li>
                        <li>• Improve platform features</li>
                        <li>• Support anime artists and creators</li>
                        <li>• Build the OneChain anime community</li>
                    </ul>
                </div>

                {isLoading && (
                    <div className="text-center text-sm text-muted-foreground">
                        Processing donation...
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
