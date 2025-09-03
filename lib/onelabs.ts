import { SuiClient } from "@onelabs/sui/client"
import { Transaction } from "@onelabs/sui/transactions"
import type { Ed25519Keypair } from "@onelabs/sui/keypairs/ed25519"

// OneChain OCT Network configuration
export const NETWORK_CONFIG = {
  testnet: {
    rpc: "https://rpc-testnet.onelabs.cc:443",
    faucet: "https://faucet-testnet.onelabs.cc:443",
    chainId: "0x1",
    name: "OneChain OCT Testnet",
    nativeCurrency: {
      name: "OCT",
      symbol: "OCT",
      decimals: 9
    }
  },
  mainnet: {
    rpc: "https://rpc.mainnet.onelabs.cc:443",
    faucet: null,
    chainId: "0x1",
    name: "OneChain OCT Mainnet",
    nativeCurrency: {
      name: "OCT",
      symbol: "OCT",
      decimals: 9
    }
  },
}

// Initialize OneChain OCT client
export const suiClient = new SuiClient({
  url: NETWORK_CONFIG.testnet.rpc,
  // OneChain OCT specific configuration
  options: {
    network: "testnet",
    chainId: NETWORK_CONFIG.testnet.chainId
  }
})

// NFT Contract addresses (these would be deployed contracts)
export const CONTRACT_ADDRESSES = {
  ANIME_NFT_PACKAGE: "0x...", // Replace with actual package ID
  MARKETPLACE_PACKAGE: "0x...", // Replace with actual package ID
}

// Helper functions for NFT operations
export class AnimeNFTService {
  private client: SuiClient

  constructor(client: SuiClient) {
    this.client = client
  }

  // Mint new anime merchandise NFT
  async mintAnimeNFT(
    keypair: Ed25519Keypair,
    name: string,
    description: string,
    imageUrl: string,
    category: string,
    rarity: string,
  ) {
    const tx = new Transaction()

    // This would call your deployed Move contract
    tx.moveCall({
      target: `${CONTRACT_ADDRESSES.ANIME_NFT_PACKAGE}::anime_nft::mint`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.string(imageUrl),
        tx.pure.string(category),
        tx.pure.string(rarity),
      ],
    })

    const result = await this.client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    })

    return result
  }

  // Get user's NFT collection
  async getUserNFTs(address: string) {
    const objects = await this.client.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${CONTRACT_ADDRESSES.ANIME_NFT_PACKAGE}::anime_nft::AnimeNFT`,
      },
      options: {
        showContent: true,
        showDisplay: true,
      },
    })

    return objects.data
  }

  // List NFT on marketplace
  async listNFT(keypair: Ed25519Keypair, nftId: string, price: number) {
    const tx = new Transaction()

    tx.moveCall({
      target: `${CONTRACT_ADDRESSES.MARKETPLACE_PACKAGE}::marketplace::list_nft`,
      arguments: [tx.object(nftId), tx.pure.u64(price)],
    })

    const result = await this.client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    })

    return result
  }

  // Purchase NFT from marketplace
  async purchaseNFT(keypair: Ed25519Keypair, listingId: string, price: number) {
    const tx = new Transaction()

    tx.moveCall({
      target: `${CONTRACT_ADDRESSES.MARKETPLACE_PACKAGE}::marketplace::purchase_nft`,
      arguments: [tx.object(listingId), tx.pure.u64(price)],
    })

    const result = await this.client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    })

    return result
  }
}

export const animeNFTService = new AnimeNFTService(suiClient)
