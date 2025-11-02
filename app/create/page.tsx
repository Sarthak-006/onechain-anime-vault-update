"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  Camera, 
  FileText, 
  Sparkles, 
  Zap,
  Wallet,
  ArrowRight,
  Shield,
  Image,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { TokenizationForm } from "@/components/tokenization/tokenization-form"
import { TokenizationPreview } from "@/components/tokenization/tokenization-preview"
import { TokenizationSuccess } from "@/components/tokenization/tokenization-success"
import { useOneWallet } from "@/lib/wallet"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { TokenizationRequest } from "@/lib/types"

const steps = [
  { 
    id: 1, 
    name: "Item Details", 
    description: "Basic information about your merchandise",
    icon: FileText,
    color: "text-blue-500"
  },
  { 
    id: 2, 
    name: "Verification", 
    description: "Upload photos and authenticity documents",
    icon: Camera,
    color: "text-green-500"
  },
  { 
    id: 3, 
    name: "Preview", 
    description: "Review your NFT before minting",
    icon: Image,
    color: "text-purple-500"
  },
  { 
    id: 4, 
    name: "Mint NFT", 
    description: "Create your NFT on the blockchain",
    icon: Sparkles,
    color: "text-yellow-500"
  },
]

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [tokenizationData, setTokenizationData] = useState<Partial<TokenizationRequest>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [mintedNFT, setMintedNFT] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { isConnected, address, connectWallet, isConnecting } = useOneWallet()
  const { toast } = useToast()

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (step === 1) {
      if (!tokenizationData.itemName) {
        newErrors.itemName = "Item name is required"
      }
      if (!tokenizationData.description) {
        newErrors.description = "Description is required"
      }
      if (!tokenizationData.category) {
        newErrors.category = "Category is required"
      }
      if (!tokenizationData.rarity) {
        newErrors.rarity = "Rarity is required"
      }
      if (!tokenizationData.attributes?.series) {
        newErrors.series = "Anime series is required"
      }
      if (!tokenizationData.attributes?.character) {
        newErrors.character = "Character is required"
      }
      if (!tokenizationData.images || tokenizationData.images.length === 0) {
        newErrors.images = "At least one image is required"
      }
    } else if (step === 2) {
      if (!tokenizationData.physicalVerification?.photos || 
          tokenizationData.physicalVerification.photos.length === 0) {
        newErrors.verification = "At least one verification photo is required"
      }
    } else if (step === 3) {
      if (!isConnected) {
        newErrors.wallet = "Please connect your wallet to mint NFTs"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
        setErrors({})
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
    }
  }, [currentStep, tokenizationData, isConnected, toast])

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }, [currentStep])

  const handleFormSubmit = useCallback((data: Partial<TokenizationRequest>) => {
    setTokenizationData({ ...tokenizationData, ...data })
    // Auto advance to next step if validation passes
    setTimeout(() => {
      if (validateStep(currentStep)) {
        handleNext()
      }
    }, 100)
  }, [tokenizationData, currentStep])

  const handleMintNFT = useCallback(async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setErrors({})
    
    try {
      // Simulate NFT minting process with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock successful mint result
      const mockNFT = {
        id: "0x" + Math.random().toString(16).substr(2, 64),
        name: tokenizationData.itemName,
        transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
        tokenId: Math.floor(Math.random() * 10000),
        createdAt: new Date().toISOString(),
      }

      setMintedNFT(mockNFT)
      setCurrentStep(4)
      
      toast({
        title: "NFT Minted Successfully! 🎉",
        description: `Your ${tokenizationData.itemName} NFT has been created on the blockchain`,
      })
    } catch (error) {
      console.error("Minting failed:", error)
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, tokenizationData, toast])

  const progress = (currentStep / steps.length) * 100
  const CurrentStepIcon = steps[currentStep - 1]?.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-8">
      <div className="container px-4 mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">NFT Minting Studio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create Your Anime NFT
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your physical anime merchandise into verified NFTs on the OneChain blockchain
          </p>

          {/* Wallet Connection Status */}
          {!isConnected && (
            <Alert className="max-w-2xl mx-auto mb-8 border-yellow-500/50 bg-yellow-500/10">
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Connect your wallet to mint NFTs</span>
                  <Button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-purple-600 text-white"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {isConnected && address && (
            <Alert className="max-w-2xl mx-auto mb-8 border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = currentStep > step.id
                const isActive = currentStep === step.id
                const isUpcoming = currentStep < step.id
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300 ${
                          isCompleted
                            ? `bg-gradient-to-br from-primary to-purple-600 border-primary text-white shadow-lg scale-110`
                            : isActive
                            ? `border-primary bg-primary/10 text-primary shadow-md scale-105`
                            : `border-muted-foreground/30 text-muted-foreground bg-muted/30`
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <StepIcon className={`h-6 w-6 ${isActive ? step.color : ""}`} />
                        )}
                        {isActive && (
                          <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping" />
                        )}
                      </div>
                      <div className={`mt-3 text-center max-w-24 ${isActive ? "" : "hidden md:block"}`}>
                        <div className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                          {step.name}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${
                        isCompleted ? "bg-gradient-to-r from-primary to-purple-600" : "bg-muted"
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>Step {currentStep} of {steps.length}</span>
              <span className="font-medium">{Math.round(progress)}% Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="mb-8 border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
            <CardTitle className="flex items-center gap-3 text-2xl">
              {CurrentStepIcon && <CurrentStepIcon className={`h-6 w-6 ${steps[currentStep - 1]?.color}`} />}
              {steps[currentStep - 1]?.name}
            </CardTitle>
            <CardDescription className="text-base">
              {steps[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Validation Errors */}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Step Content */}
            {currentStep === 1 && (
              <TokenizationForm 
                onSubmit={handleFormSubmit} 
                initialData={tokenizationData}
              />
            )}
            {currentStep === 2 && (
              <TokenizationForm 
                onSubmit={handleFormSubmit} 
                initialData={tokenizationData} 
                step="verification" 
              />
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                {!isConnected && (
                  <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <Wallet className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span>Wallet connection required to mint NFT</span>
                        <Button
                          onClick={connectWallet}
                          disabled={isConnecting}
                          size="sm"
                          className="bg-gradient-to-r from-primary to-purple-600 text-white"
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Wallet className="h-4 w-4 mr-2" />
                              Connect Wallet
                            </>
                          )}
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                <TokenizationPreview 
                  data={tokenizationData} 
                  onConfirm={handleMintNFT} 
                  isLoading={isLoading}
                />
              </div>
            )}
            {currentStep === 4 && <TokenizationSuccess nft={mintedNFT} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 rounded-xl px-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>All data is securely processed</span>
            </div>

            {currentStep === 3 ? (
              <Button
                onClick={handleMintNFT}
                disabled={isLoading || !isConnected}
                className="flex items-center gap-2 rounded-xl px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Mint NFT
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/50"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Quick Links */}
        {currentStep === 4 && (
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/marketplace">
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Marketplace
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/dashboard">
                View Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/create">
                Create Another NFT
              </Link>
            </Button>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 border-2 bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Need Help?
            </CardTitle>
            <CardDescription>
              Learn more about minting NFTs and the complete lifecycle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-background border">
                <div className="font-semibold mb-1">📸 Image Requirements</div>
                <div className="text-muted-foreground">
                  Upload high-quality photos (PNG, JPG up to 10MB each)
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background border">
                <div className="font-semibold mb-1">✅ Verification Process</div>
                <div className="text-muted-foreground">
                  Provide authentication photos and certificates for verification
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background border">
                <div className="font-semibold mb-1">⚡ Minting Costs</div>
                <div className="text-muted-foreground">
                  Small gas fee (~0.1 OCT) required to mint your NFT
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
