"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Sparkles, Eye, Tag, User, Shield } from "lucide-react"
import type { TokenizationRequest } from "@/lib/types"

interface TokenizationPreviewProps {
  data: Partial<TokenizationRequest>
  onConfirm: () => void
  isLoading: boolean
}

export function TokenizationPreview({ data, onConfirm, isLoading }: TokenizationPreviewProps) {
  const getRarityColor = (rarity?: string) => {
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
    <div className="space-y-6">
      {/* NFT Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="relative">
            {data.images && data.images.length > 0 ? (
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {data.images[0] instanceof File ? (
                  <img
                    src={URL.createObjectURL(data.images[0])}
                    alt="NFT Preview"
                    className="w-full h-full object-cover"
                  />
                ) : typeof data.images[0] === 'string' ? (
                  <img
                    src={data.images[0]}
                    alt="NFT Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">NFT Image Preview</p>
                    <p className="text-xs text-muted-foreground mt-1">{data.images.length} image(s) uploaded</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No image uploaded</p>
                  <p className="text-xs text-destructive mt-1">Please go back and upload an image</p>
                </div>
              </div>
            )}
            <div
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium ${getRarityColor(data.rarity)}`}
            >
              {data.rarity?.toUpperCase()}
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{data.itemName}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{data.description}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{data.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Item Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Series:</span>
                  <p className="font-medium">{data.attributes?.series}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Character:</span>
                  <p className="font-medium">{data.attributes?.character}</p>
                </div>
                {data.attributes?.manufacturer && (
                  <div>
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <p className="font-medium">{data.attributes.manufacturer}</p>
                  </div>
                )}
                {data.attributes?.releaseYear && (
                  <div>
                    <span className="text-muted-foreground">Release Year:</span>
                    <p className="font-medium">{data.attributes.releaseYear}</p>
                  </div>
                )}
                {data.attributes?.condition && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Condition:</span>
                    <p className="font-medium capitalize">{data.attributes.condition.replace("-", " ")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verification Photos:</span>
                  <span className="font-medium">{data.physicalVerification?.photos?.length || 0} uploaded</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Certificates:</span>
                  <span className="font-medium">{data.physicalVerification?.certificates?.length || 0} uploaded</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Blockchain Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span className="font-medium">OneLabs Testnet</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Standard:</span>
                <span className="font-medium">SUI NFT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Minting Fee:</span>
                <span className="font-medium">~0.1 OCT</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Confirmation */}
      <div className="text-center space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Ready to Mint Your NFT?</h3>
          <p className="text-muted-foreground">
            Once minted, your NFT will be permanently recorded on the OneLabs blockchain and cannot be modified.
          </p>
        </div>

        <Button 
          onClick={onConfirm} 
          disabled={isLoading || !data.images || data.images.length === 0} 
          size="lg" 
          className="px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting NFT...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Mint NFT
            </>
          )}
        </Button>
        
        {(!data.images || data.images.length === 0) && (
          <p className="text-sm text-destructive text-center">
            Please go back and upload an image before minting.
          </p>
        )}

        {isLoading && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Creating your NFT on the blockchain...</p>
            <p>This may take a few moments.</p>
          </div>
        )}
      </div>
    </div>
  )
}
