"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, Share2, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

interface TokenizationSuccessProps {
  nft: {
    id: string
    name: string
    transactionHash: string
    tokenId: number
  } | null
}

export function TokenizationSuccess({ nft }: TokenizationSuccessProps) {
  if (!nft) return null

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out my new NFT: ${nft.name}`,
        text: `I just minted "${nft.name}" as an NFT on AnimeVault!`,
        url: window.location.origin + `/marketplace/${nft.id}`,
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.origin + `/marketplace/${nft.id}`)
    }
  }

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">NFT Minted Successfully!</h2>
        <p className="text-muted-foreground">
          Your anime merchandise has been successfully tokenized and is now live on the blockchain.
        </p>
      </div>

      {/* NFT Details Card */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{nft.name}</span>
            <Badge variant="secondary">#{nft.tokenId}</Badge>
          </CardTitle>
          <CardDescription>Your new NFT is ready!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Token ID:</span>
              <span className="font-mono">#{nft.tokenId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">NFT ID:</span>
              <span className="font-mono text-xs">{nft.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Network:</span>
              <span>OneLabs Testnet</span>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
              <a
                href={`https://onescan.cc/testnet/transactionBlocksDetail?digest=${nft.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                View on Explorer
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <Button onClick={handleShare} variant="outline" className="flex items-center gap-2 bg-transparent">
          <Share2 className="h-4 w-4" />
          Share NFT
        </Button>
        <Button asChild className="flex items-center gap-2">
          <Link href={`/marketplace/${nft.id}`}>
            <Eye className="h-4 w-4" />
            View NFT
          </Link>
        </Button>
      </div>

      {/* Next Steps */}
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">1</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">List on Marketplace</p>
              <p className="text-sm text-muted-foreground">Set a price and list your NFT for sale</p>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/marketplace/list">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">2</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">View Your Collection</p>
              <p className="text-sm text-muted-foreground">See all your NFTs in your dashboard</p>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">3</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Create Another NFT</p>
              <p className="text-sm text-muted-foreground">Tokenize more of your collection</p>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/create">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
