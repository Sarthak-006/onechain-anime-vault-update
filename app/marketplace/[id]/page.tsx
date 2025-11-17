"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, ExternalLink, Clock, Eye, TrendingUp, Shield, Award, User, Tag, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@onelabs/dapp-kit"
import { useOneWallet } from "@/lib/wallet"
import { createPurchaseTransaction } from "@/lib/nft-operations"
import { getExplorerUrl } from "@/lib/onelabs"

// Mock NFT data - in real app, this would be fetched based on the ID
const mockNFT = {
  id: "1",
  name: "Demon Slayer Tanjiro Figure",
  description:
    "Premium quality Tanjiro Kamado figure from the hit anime series Demon Slayer. This officially licensed collectible features incredible attention to detail, from Tanjiro's distinctive checkered haori to his determined expression. Perfect for any Demon Slayer fan or anime collector.",
  imageUrl: "/placeholder.svg?height=600&width=600&text=Tanjiro+Figure",
  category: "figure",
  rarity: "rare",
  creator: "0x1234567890abcdef",
  owner: "0x8765432109fedcba",
  price: 12.5,
  isListed: true,
  createdAt: "2024-01-15",
  attributes: {
    series: "Demon Slayer",
    character: "Tanjiro Kamado",
    manufacturer: "Good Smile Company",
    releaseYear: 2023,
    condition: "mint",
  },
  stats: {
    views: 1247,
    likes: 89,
    priceChange: "+12%",
  },
  history: [
    {
      event: "Listed",
      price: 12.5,
      from: "0x8765432109fedcba",
      to: null,
      date: "2024-01-15T10:30:00Z",
      txHash: "0xabc123...",
    },
    {
      event: "Minted",
      price: null,
      from: null,
      to: "0x8765432109fedcba",
      date: "2024-01-15T09:15:00Z",
      txHash: "0xdef456...",
    },
  ],
}

export default function NFTDetailPage() {
  const params = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { toast } = useToast()
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending: isTransactionPending } = useSignAndExecuteTransaction()
  const suiClient = useSuiClient()
  const { isConnected } = useOneWallet()

  // TODO: Fetch actual listing ID from the NFT ID
  // For now, this is a placeholder - in production, you'd query the blockchain
  // to find the Listing object associated with this NFT
  const listingId = "" // This should be fetched from the blockchain

  const handlePurchase = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!listingId) {
      toast({
        title: "Listing not found",
        description: "This NFT is not currently listed for sale",
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(true)

    try {
      const tx = createPurchaseTransaction(listingId)

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

      console.log("Purchase successful:", digest)
      console.log("View on Explorer:", getExplorerUrl("transaction", digest))

      toast({
        title: "NFT Purchased Successfully! 🎉",
        description: `You are now the owner of ${mockNFT.name}. View on explorer: ${getExplorerUrl("transaction", digest)}`,
      })

      // TODO: Refresh the page or update state to reflect new ownership
    } catch (error: any) {
      console.error("Purchase failed:", error)
      toast({
        title: "Purchase failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockNFT.name,
        text: `Check out this amazing anime NFT: ${mockNFT.name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-400 to-orange-500"
      case "epic":
        return "bg-gradient-to-r from-purple-400 to-pink-500"
      case "rare":
        return "bg-gradient-to-r from-blue-400 to-cyan-500"
      case "uncommon":
        return "bg-gradient-to-r from-green-400 to-emerald-500"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/marketplace">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* NFT Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={mockNFT.imageUrl || "/placeholder.svg"}
                  alt={mockNFT.name}
                  className="w-full aspect-square object-cover"
                />
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium ${getRarityColor(mockNFT.rarity)}`}
                >
                  {mockNFT.rarity.toUpperCase()}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{mockNFT.stats.views}</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </Card>
              <Card className="text-center p-4">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{mockNFT.stats.likes}</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </Card>
              <Card className="text-center p-4">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-500">{mockNFT.stats.priceChange}</div>
                <div className="text-sm text-muted-foreground">24h Change</div>
              </Card>
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{mockNFT.name}</h1>
              <p className="text-muted-foreground mb-4">{mockNFT.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{mockNFT.category}</Badge>
                <Badge variant="outline">{mockNFT.attributes.series}</Badge>
              </div>
            </div>

            {/* Price and Purchase */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Price</span>
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    {mockNFT.stats.priceChange}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-4">{mockNFT.price} OCT</div>
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handlePurchase} disabled={isPurchasing || isTransactionPending}>
                    {isPurchasing || isTransactionPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Buy Now"
                    )}
                  </Button>
                  <Button variant="outline" className="bg-transparent" disabled>
                    Make Offer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>OW</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Anonymous Collector</div>
                    <div className="text-sm text-muted-foreground font-mono">{mockNFT.owner}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Creator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>CR</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Anime Collector Pro</div>
                    <div className="text-sm text-muted-foreground font-mono">{mockNFT.creator}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="more">More from Collection</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Series:</span>
                      <p className="font-medium">{mockNFT.attributes.series}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Character:</span>
                      <p className="font-medium">{mockNFT.attributes.character}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Manufacturer:</span>
                      <p className="font-medium">{mockNFT.attributes.manufacturer}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Release Year:</span>
                      <p className="font-medium">{mockNFT.attributes.releaseYear}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Condition:</span>
                      <p className="font-medium capitalize">{mockNFT.attributes.condition}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rarity:</span>
                      <p className="font-medium capitalize">{mockNFT.rarity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Blockchain Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Token ID:</span>
                      <span className="font-mono">#{mockNFT.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span>OneLabs Testnet</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Standard:</span>
                      <span>SUI NFT</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(mockNFT.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Separator />
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Complete ownership and transaction history for this NFT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNFT.history.map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {event.event === "Minted" ? (
                          <Award className="h-5 w-5 text-primary" />
                        ) : (
                          <Tag className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{event.event}</span>
                          {event.price && <span className="font-bold">{event.price} OCT</span>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3" />
                            {new Date(event.date).toLocaleString()}
                          </div>
                          {event.from && (
                            <div>
                              From: <span className="font-mono">{event.from}</span>
                            </div>
                          )}
                          {event.to && (
                            <div>
                              To: <span className="font-mono">{event.to}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="more" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>More from this Collection</CardTitle>
                <CardDescription>Discover other NFTs from the same creator or series</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>More items from this collection will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
