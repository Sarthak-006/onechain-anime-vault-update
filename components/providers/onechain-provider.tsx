"use client"

import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@onelabs/dapp-kit"
import { getFullnodeUrl } from "@onelabs/sui/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

// OneChain OCT Network Configuration
const ONECHAIN_OCT_NETWORK = {
    testnet: {
        url: "https://rpc-testnet.onelabs.cc:443",
        chainId: "0x1",
        name: "OneChain OCT Testnet",
        nativeCurrency: {
            name: "OCT",
            symbol: "OCT",
            decimals: 9
        },
        // OneChain specific configuration
        faucetUrl: "https://faucet-testnet.onelabs.cc:443"
    }
}

interface OneChainProviderWrapperProps {
    children: ReactNode
}

export function OneChainProviderWrapper({ children }: OneChainProviderWrapperProps) {
    // Create network configuration for OneChain OCT
    const { networkConfig } = createNetworkConfig({
        testnet: ONECHAIN_OCT_NETWORK.testnet,
        mainnet: {
            url: "https://rpc.mainnet.onelabs.cc:443",
            chainId: "0x1",
            name: "OneChain OCT Mainnet",
            nativeCurrency: {
                name: "OCT",
                symbol: "OCT",
                decimals: 9
            }
        },
    })

    // Create a QueryClient instance for the WalletProvider
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                retry: 1,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider
                networks={networkConfig}
                defaultNetwork="testnet"
                // Force OneChain OCT testnet configuration
                networkConfig={{
                    testnet: ONECHAIN_OCT_NETWORK.testnet
                }}
                // Additional OneChain OCT configuration
                options={{
                    network: "testnet",
                    chainId: "0x1",
                    nativeCurrency: {
                        name: "OCT",
                        symbol: "OCT",
                        decimals: 9
                    }
                }}
            >
                <WalletProvider>
                    {children}
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    )
}
