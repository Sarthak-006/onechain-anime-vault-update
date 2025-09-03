"use client"

import { useOneWallet } from "@/lib/wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Coins, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useSuiClient, useSignAndExecuteTransaction } from "@onelabs/dapp-kit"
import { Transaction } from "@onelabs/sui/transactions"

export function SimpleTransaction() {
    const { address, isConnected, connectWallet } = useOneWallet()
    const { toast } = useToast()
    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState("0.3")
    const [isLoading, setIsLoading] = useState(false)

    const client = useSuiClient()
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()

    // Anime Vault Collection Address - your actual OneWallet address
    const animeVaultCollection = "0x0afb16edad0861f1c1d3238bee4a759a75aad531ed363ee692a30108d6c4c8a4"

    const handleSendTransaction = async () => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet first",
                variant: "destructive"
            })
            return
        }

        if (!recipient || !amount) {
            toast({
                title: "Missing information",
                description: "Please fill in both recipient and amount",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)

        try {
            // Convert OCT to MIST (1 OCT = 1,000,000,000 MIST)
            const amountInMist = Math.floor(parseFloat(amount) * 1_000_000_000)

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

            // Create transaction
            const tx = new Transaction()

            // Use the first coin object for transfer
            const primaryCoin = coins.data[0].coinObjectId

            // If we need more than what's in the first coin, merge coins first
            if (coins.data[0].balance < amountInMist) {
                // Merge all coins to have enough balance
                const coinObjects = coins.data.map(coin => tx.object(coin.coinObjectId))
                const mergedCoin = tx.mergeCoins(tx.object(primaryCoin), coinObjects.slice(1))

                // Split the required amount
                const [coinToTransfer] = tx.splitCoins(mergedCoin, [amountInMist])
                tx.transferObjects([coinToTransfer], recipient)
            } else {
                // Split from the primary coin
                const [coinToTransfer] = tx.splitCoins(tx.object(primaryCoin), [amountInMist])
                tx.transferObjects([coinToTransfer], recipient)
            }

            // Sign and execute transaction
            signAndExecuteTransaction(
                {
                    transaction: tx,
                },
                {
                    onSuccess: (result) => {
                        toast({
                            title: "Transaction successful! 🎉",
                            description: `Sent ${amount} OCT to ${recipient.slice(0, 8)}...`,
                        })

                        // Reset form
                        setRecipient("")
                        setAmount("0.3")

                        console.log("Transaction result:", result)
                    },
                    onError: (error) => {
                        toast({
                            title: "Transaction failed",
                            description: error.message || "Please try again",
                            variant: "destructive"
                        })
                        console.error("Transaction error:", error)
                    }
                }
            )

        } catch (error: any) {
            toast({
                title: "Transaction failed",
                description: error.message || "Please try again",
                variant: "destructive"
            })
            console.error("Transaction error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDonateToCollection = async () => {
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
            // Send 0.3 OCT to the anime vault collection
            const amountInMist = 300_000_000 // 0.3 OCT in MIST

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
                            description: "Thank you for supporting the Anime Vault collection!",
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
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Transaction
                    </CardTitle>
                    <CardDescription>
                        Connect your wallet to send transactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={connectWallet} className="w-full">
                        Connect Wallet First
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    OCT Testnet Transactions
                </CardTitle>
                <CardDescription>
                    Send OCT tokens on OneChain testnet
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Quick Donation to Anime Vault */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Support Anime Vault</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                        Donate 0.3 OCT to help grow the anime NFT collection
                    </p>
                    <Button
                        onClick={handleDonateToCollection}
                        disabled={isLoading}
                        size="sm"
                        className="w-full"
                    >
                        <Gift className="h-4 w-4 mr-2" />
                        {isLoading ? "Sending..." : "Donate 0.3 OCT"}
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">OR</div>

                {/* Custom Transaction */}
                <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                        id="recipient"
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount">Amount (OCT)</Label>
                    <div className="relative">
                        <Input
                            id="amount"
                            type="number"
                            step="0.1"
                            placeholder="0.3"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-muted-foreground">
                            <Coins className="h-3 w-3" />
                            OCT
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleSendTransaction}
                    disabled={isLoading}
                    className="w-full"
                >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? "Sending..." : "Send Transaction"}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                    💡 Make sure you have OCT testnet tokens in your wallet
                </div>
            </CardContent>
        </Card>
    )
}
