"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@onelabs/dapp-kit"
import { useOneWallet } from "@/lib/wallet"
import { createListForSaleTransaction } from "@/lib/nft-operations"
import { Loader2 } from "lucide-react"
import { getExplorerUrl } from "@/lib/onelabs"
import { logTransaction, markNFTListed } from "@/lib/nft-repository"

interface ListNFTDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nftId: string
  nftName: string
  ownerAddress: string
  onListed?: () => void
}

export function ListNFTDialog({ open, onOpenChange, nftId, nftName, ownerAddress, onListed }: ListNFTDialogProps) {
  const [price, setPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending: isTransactionPending } = useSignAndExecuteTransaction()
  const suiClient = useSuiClient()
  const { isConnected } = useOneWallet()

  const handleList = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!ownerAddress) {
      toast({
        title: "Missing owner address",
        description: "Unable to determine NFT owner. Please reconnect your wallet.",
        variant: "destructive",
      })
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const tx = createListForSaleTransaction(nftId, priceNum)

      const digest = await new Promise<string>((resolve, reject) => {
        signAndExecute(
          { transaction: tx as any },
          {
            onError: (error) => reject(error),
            onSuccess: ({ digest }) => resolve(digest),
          }
        )
      })

      const result = await suiClient.waitForTransaction({
        digest,
        options: { showEffects: true, showObjectChanges: true },
      })

      // Find the created Listing object
      const listingObject = result.objectChanges?.find(
        (obj: any) => obj.type === "created" && obj.objectType?.includes("Listing")
      )

      const listingId = listingObject?.objectId || ""
      if (!listingId) {
        throw new Error("Unable to determine Listing object ID from transaction response")
      }

      await markNFTListed(nftId, {
        listing_id: listingId,
        listing_price_oct: priceNum,
        list_tx_digest: digest,
        status: "listed",
      })

      await logTransaction({
        nft_object_id: nftId,
        type: "list",
        tx_digest: digest,
        actor_address: account?.address || "",
        price_oct: priceNum,
      })

      console.log("NFT listed successfully:", listingId)
      console.log("Transaction Hash:", digest)
      console.log("View on Explorer:", getExplorerUrl("transaction", digest))

      toast({
        title: "NFT Listed Successfully! 🎉",
        description: `Your NFT has been listed for ${priceNum} OCT. View on explorer: ${getExplorerUrl("transaction", digest)}`,
      })

      onOpenChange(false)
      setPrice("")
      onListed?.()
    } catch (error: any) {
      console.error("Listing failed:", error)
      toast({
        title: "Listing failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List NFT for Sale</DialogTitle>
          <DialogDescription>
            Set a price for <strong>{nftName}</strong> to list it on the marketplace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (OCT)</Label>
            <Input
              id="price"
              type="number"
              step="0.1"
              min="0"
              placeholder="Enter price in OCT"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isLoading || isTransactionPending}
            />
            <p className="text-xs text-muted-foreground">
              The NFT will be listed as a shared object and can be purchased by anyone.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || isTransactionPending}>
            Cancel
          </Button>
          <Button onClick={handleList} disabled={isLoading || isTransactionPending || !price}>
            {isLoading || isTransactionPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Listing...
              </>
            ) : (
              "List for Sale"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

