"use client"

import { useOneWallet } from "@/lib/wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useSuiClient } from "@onelabs/dapp-kit"
// Remove the import - we'll use a different approach

export function FaucetRequest() {
    const { address, isConnected, connectWallet } = useOneWallet()
    const { toast } = useToast()
    const [isRequesting, setIsRequesting] = useState(false)

    const client = useSuiClient()

    const handleFaucetRequest = async () => {
        if (!isConnected || !address) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet first",
                variant: "destructive"
            })
            return
        }

        setIsRequesting(true)

        try {
            // Use direct fetch to OneChain faucet
            const faucetUrl = "https://faucet-testnet.onelabs.cc:443"

            const response = await fetch(faucetUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipient: address,
                }),
            })

            if (response.ok) {
                toast({
                    title: "Faucet request successful! 💧",
                    description: "OCT testnet tokens are being sent to your wallet",
                })
            } else {
                throw new Error("Faucet request failed")
            }

        } catch (error: any) {
            toast({
                title: "Faucet request failed",
                description: "Please try the manual faucet link below",
                variant: "destructive"
            })
            console.error("Faucet error:", error)
        } finally {
            setIsRequesting(false)
        }
    }

    if (!isConnected) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        Get Testnet Tokens
                    </CardTitle>
                    <CardDescription>
                        Connect your wallet to request OCT testnet tokens
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
                    <Droplets className="h-5 w-5 text-blue-500" />
                    Get Testnet Tokens
                </CardTitle>
                <CardDescription>
                    Request OCT tokens for testing on OneChain testnet
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-900 mb-1">Your Address:</div>
                    <div className="text-xs text-blue-700 font-mono break-all">
                        {address}
                    </div>
                </div>

                <Button
                    onClick={handleFaucetRequest}
                    disabled={isRequesting}
                    className="w-full"
                >
                    <Droplets className="h-4 w-4 mr-2" />
                    {isRequesting ? "Requesting..." : "Request OCT Tokens"}
                </Button>

                <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">Or use manual faucet:</div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open("https://faucet-testnet.onelabs.cc:443", "_blank")}
                        className="w-full"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Faucet Website
                    </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                    💡 You need OCT testnet tokens to send transactions
                </div>
            </CardContent>
        </Card>
    )
}
