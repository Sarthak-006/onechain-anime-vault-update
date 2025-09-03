"use client"

import { useConnectWallet, useDisconnectWallet, useCurrentAccount, useWallets } from "@onelabs/dapp-kit"

export function shortenAddress(address: string, size = 4): string {
    if (!address) return ""
    if (address.length <= size * 2 + 2) return address
    return `${address.slice(0, 2 + size)}...${address.slice(-size)}`
}

// Custom hook for OneWallet connection (MetaMask-like experience)
export function useOneWallet() {
    const wallets = useWallets()
    const { mutate: connect, isPending: isConnecting } = useConnectWallet()
    const { mutate: disconnect } = useDisconnectWallet()
    const account = useCurrentAccount()

    // Find OneWallet from available wallets
    const oneWallet = wallets.find(wallet =>
        wallet.name.toLowerCase().includes('onewallet') ||
        wallet.name.toLowerCase().includes('onechain')
    )

    const connectWallet = () => {
        if (!oneWallet) {
            throw new Error("OneWallet not found. Please install the OneChain wallet extension.")
        }

        connect(
            { wallet: oneWallet },
            {
                onSuccess: () => {
                    console.log("Successfully connected to OneWallet")
                },
                onError: (error) => {
                    console.error("Failed to connect to OneWallet:", error)
                    throw error
                }
            }
        )
    }

    const disconnectWallet = () => {
        disconnect()
    }

    return {
        account,
        connectWallet,
        disconnectWallet,
        isConnecting,
        isConnected: !!account,
        address: account?.address,
        oneWallet
    }
}


