import { Transaction } from "@onelabs/sui/transactions"
import { CONTRACT_ADDRESSES, CONTRACT_MODULE } from "./onelabs"

/**
 * Create a transaction to list an NFT for sale
 * @param nftId - The NFT object ID (LandData)
 * @param price - Price in OCT (will be converted to MIST: price * 1_000_000_000)
 * @returns Transaction object ready to execute
 */
export function createListForSaleTransaction(nftId: string, price: number): Transaction {
  const tx = new Transaction()
  
  // Convert OCT to MIST (1 OCT = 1_000_000_000 MIST)
  const priceInMist = BigInt(Math.floor(price * 1_000_000_000))
  
  tx.moveCall({
    package: CONTRACT_ADDRESSES.PACKAGE_ID,
    module: CONTRACT_MODULE,
    function: "list_for_sale",
    arguments: [
      tx.object(nftId), // LandData object (owned by sender)
      tx.pure.u256(priceInMist), // Price in MIST
    ],
  })

  return tx
}

/**
 * Create a transaction to purchase a listed NFT
 * @param listingId - The Listing shared object ID
 * @returns Transaction object ready to execute
 */
export function createPurchaseTransaction(listingId: string): Transaction {
  const tx = new Transaction()
  
  tx.moveCall({
    package: CONTRACT_ADDRESSES.PACKAGE_ID,
    module: CONTRACT_MODULE,
    function: "purchase_listed_nft",
    arguments: [
      tx.object(listingId), // Listing shared object
    ],
  })

  return tx
}

