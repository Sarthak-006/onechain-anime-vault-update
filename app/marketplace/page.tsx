"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Eye,
  TrendingUp,
  Clock,
  Sparkles,
  ShoppingBag,
  Layers,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Wallet,
  Zap,
  Trophy,
  TrendingDown,
} from "lucide-react"
import Link from "next/link"
import { useOneWallet } from "@/lib/wallet"
import { useToast } from "@/hooks/use-toast"
import type { AnimeNFT } from "@/lib/types"

// Enhanced mock data with lifecycle stages
const mockNFTs: (AnimeNFT & {
  lifecycleStage: "minted" | "listed" | "trading" | "collected"
  listedPrice?: number
  mintedDate: string
  lastTraded?: string
  tradeHistory?: Array<{ from: string; to: string; price: number; date: string }>
})[] = [
  {
    id: "1",
    name: "Demon Slayer Tanjiro Figure",
    description: "Premium quality Tanjiro Kamado figure from the hit anime series Demon Slayer",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Tanjiro+Figure",
    category: "figure",
    rarity: "rare",
    creator: "0x1234...5678",
    owner: "0x8765...4321",
    price: 12.5,
    isListed: true,
    createdAt: "2024-01-15",
    lifecycleStage: "trading",
    listedPrice: 12.5,
    mintedDate: "2024-01-10",
    lastTraded: "2024-01-12",
    tradeHistory: [
      { from: "0x1234...5678", to: "0x8765...4321", price: 12.5, date: "2024-01-12" },
      { from: "0x1111...2222", to: "0x1234...5678", price: 10.0, date: "2024-01-10" },
    ],
    attributes: {
      series: "Demon Slayer",
      character: "Tanjiro Kamado",
      manufacturer: "Good Smile Company",
      releaseYear: 2023,
      condition: "mint",
    },
  },
  {
    id: "2",
    name: "Attack on Titan Survey Corps Badge",
    description: "Official Survey Corps badge replica from Attack on Titan",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Survey+Corps+Badge",
    category: "accessory",
    rarity: "uncommon",
    creator: "0x2345...6789",
    owner: "0x9876...5432",
    price: 8.3,
    isListed: true,
    createdAt: "2024-01-14",
    lifecycleStage: "listed",
    listedPrice: 8.3,
    mintedDate: "2024-01-14",
    attributes: {
      series: "Attack on Titan",
      character: "Survey Corps",
      manufacturer: "Crunchyroll Store",
      releaseYear: 2022,
      condition: "near-mint",
    },
  },
  {
    id: "3",
    name: "One Piece Luffy Gold Card",
    description: "Ultra rare holographic Monkey D. Luffy trading card",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Luffy+Gold+Card",
    category: "card",
    rarity: "legendary",
    creator: "0x3456...7890",
    owner: "0x0987...6543",
    price: 25.0,
    isListed: true,
    createdAt: "2024-01-13",
    lifecycleStage: "collected",
    mintedDate: "2024-01-13",
    attributes: {
      series: "One Piece",
      character: "Monkey D. Luffy",
      manufacturer: "Bandai",
      releaseYear: 2024,
      condition: "mint",
    },
  },
  {
    id: "4",
    name: "Naruto Hokage Poster",
    description: "Limited edition poster featuring all Hokage from Naruto series",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Hokage+Poster",
    category: "poster",
    rarity: "epic",
    creator: "0x4567...8901",
    owner: "0x1098...7654",
    price: 15.8,
    isListed: false,
    createdAt: "2024-01-12",
    lifecycleStage: "minted",
    mintedDate: "2024-01-12",
    attributes: {
      series: "Naruto",
      character: "All Hokage",
      manufacturer: "Viz Media",
      releaseYear: 2023,
      condition: "mint",
    },
  },
  {
    id: "5",
    name: "My Hero Academia Deku Nendoroid",
    description: "Adorable Deku Nendoroid with multiple expressions and accessories",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Deku+Nendoroid",
    category: "figure",
    rarity: "rare",
    creator: "0x5678...9012",
    owner: "0x2109...8765",
    price: 18.2,
    isListed: true,
    createdAt: "2024-01-11",
    lifecycleStage: "trading",
    listedPrice: 18.2,
    mintedDate: "2024-01-11",
    lastTraded: "2024-01-11",
    attributes: {
      series: "My Hero Academia",
      character: "Izuku Midoriya",
      manufacturer: "Good Smile Company",
      releaseYear: 2023,
      condition: "mint",
    },
  },
  {
    id: "6",
    name: "Dragon Ball Z Goku Keychain",
    description: "Collectible Goku keychain from Dragon Ball Z series",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Goku+Keychain",
    category: "accessory",
    rarity: "common",
    creator: "0x6789...0123",
    owner: "0x3210...9876",
    price: 4.5,
    isListed: true,
    createdAt: "2024-01-10",
    lifecycleStage: "listed",
    listedPrice: 4.5,
    mintedDate: "2024-01-10",
    attributes: {
      series: "Dragon Ball Z",
      character: "Son Goku",
      manufacturer: "Toei Animation",
      releaseYear: 2022,
      condition: "good",
    },
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedNFT, setSelectedNFT] = useState<any>(null)
  const [showMintDialog, setShowMintDialog] = useState(false)
  const [showListDialog, setShowListDialog] = useState(false)
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { isConnected, address } = useOneWallet()
  const { toast } = useToast()

  const categories = ["figure", "card", "poster", "accessory", "other"]
  const rarities = ["common", "uncommon", "rare", "epic", "legendary"]
  const lifecycleStages = ["minted", "listed", "trading", "collected"]

  // Calculate marketplace stats
  const marketplaceStats = useMemo(() => {
    const totalNFTs = mockNFTs.length
    const mintedCount = mockNFTs.filter((n) => n.lifecycleStage === "minted").length
    const listedCount = mockNFTs.filter((n) => n.lifecycleStage === "listed").length
    const tradingCount = mockNFTs.filter((n) => n.lifecycleStage === "trading").length
    const collectedCount = mockNFTs.filter((n) => n.lifecycleStage === "collected").length
    const totalVolume = mockNFTs.reduce((sum, nft) => sum + (nft.price || 0), 0)
    const averagePrice = totalVolume / totalNFTs

    return {
      totalNFTs,
      mintedCount,
      listedCount,
      tradingCount,
      collectedCount,
      totalVolume,
      averagePrice,
    }
  }, [])

  const filteredAndSortedNFTs = useMemo(() => {
    let filtered = mockNFTs

    // Tab filtering
    if (activeTab !== "all") {
      filtered = filtered.filter((nft) => nft.lifecycleStage === activeTab)
    }

    // Search filtering
    if (searchQuery) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.attributes.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.attributes.character.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filtering
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((nft) => selectedCategories.includes(nft.category))
    }

    // Rarity filtering
    if (selectedRarities.length > 0) {
      filtered = filtered.filter((nft) => selectedRarities.includes(nft.rarity))
    }

    // Lifecycle stage filtering
    if (selectedStages.length > 0) {
      filtered = filtered.filter((nft) => selectedStages.includes(nft.lifecycleStage))
    }

    // Price filtering
    filtered = filtered.filter((nft) => {
      const price = nft.price || nft.listedPrice || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0)
        case "price-high":
          return (b.price || 0) - (a.price || 0)
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategories, selectedRarities, selectedStages, priceRange, sortBy, activeTab])

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

  const getStageInfo = (stage: string) => {
    switch (stage) {
      case "minted":
        return {
          label: "Minted",
          icon: Sparkles,
          color: "bg-blue-500",
          description: "Recently minted NFT",
        }
      case "listed":
        return {
          label: "Listed",
          icon: ShoppingBag,
          color: "bg-green-500",
          description: "Available for purchase",
        }
      case "trading":
        return {
          label: "Trading",
          icon: TrendingUp,
          color: "bg-purple-500",
          description: "Active in marketplace",
        }
      case "collected":
        return {
          label: "Collected",
          icon: Trophy,
          color: "bg-yellow-500",
          description: "In collector's vault",
        }
      default:
        return {
          label: "Unknown",
          icon: Layers,
          color: "bg-gray-500",
          description: "",
        }
    }
  }

  const handleMint = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Simulate minting process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "NFT Minted! 🎉",
        description: "Your NFT has been successfully minted to the blockchain",
      })
      setShowMintDialog(false)
    } catch (error) {
      toast({
        title: "Minting failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleList = async (nft: any, price: number) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to list NFTs",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "NFT Listed! 📋",
        description: `Your NFT has been listed for ${price} OCT`,
      })
      setShowListDialog(false)
    } catch (error) {
      toast({
        title: "Listing failed",
        description: "There was an error listing your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBuy = async (nft: any) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase NFTs",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Purchase Successful! 🎊",
        description: `You've successfully purchased ${nft.name} for ${nft.price} OCT`,
      })
      setShowBuyDialog(false)
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "There was an error completing the purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container px-4 mx-auto py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Complete NFT Lifecycle</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Anime NFT Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the complete lifecycle: <span className="font-semibold text-primary">Mint</span> →{" "}
            <span className="font-semibold text-green-500">List</span> →{" "}
            <span className="font-semibold text-purple-500">Trade</span> →{" "}
            <span className="font-semibold text-yellow-500">Collect</span>
          </p>

          {/* Lifecycle Visualization */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              { stage: "minted", label: "Mint", icon: Sparkles },
              { stage: "listed", label: "List", icon: ShoppingBag },
              { stage: "trading", label: "Trade", icon: TrendingUp },
              { stage: "collected", label: "Collect", icon: Trophy },
            ].map((item, index) => {
              const Icon = item.icon
              const info = getStageInfo(item.stage)
              return (
                <div key={item.stage} className="flex items-center gap-2">
                  <Card className="border-2 hover:border-primary transition-all cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`${info.color} rounded-full p-2`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {marketplaceStats[`${item.stage}Count` as keyof typeof marketplaceStats]} NFTs
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < 3 && (
                    <ArrowDownRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Marketplace Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{marketplaceStats.totalNFTs}</div>
                <div className="text-sm text-muted-foreground">Total NFTs</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{marketplaceStats.listedCount}</div>
                <div className="text-sm text-muted-foreground">Listed</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-500">{marketplaceStats.totalVolume.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Total Volume (OCT)</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{marketplaceStats.averagePrice.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Avg Price (OCT)</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <TabsList className="grid w-full lg:w-auto grid-cols-5 bg-muted/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger
                value="minted"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Minted
              </TabsTrigger>
              <TabsTrigger
                value="listed"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Listed
              </TabsTrigger>
              <TabsTrigger
                value="trading"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                Trading
              </TabsTrigger>
              <TabsTrigger
                value="collected"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
              >
                Collected
              </TabsTrigger>
            </TabsList>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search anime NFTs, series, or characters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Sidebar */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Category</Label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category])
                              } else {
                                setSelectedCategories(selectedCategories.filter((c) => c !== category))
                              }
                            }}
                          />
                          <Label htmlFor={category} className="text-sm capitalize cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rarity */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Rarity</Label>
                    <div className="space-y-2">
                      {rarities.map((rarity) => (
                        <div key={rarity} className="flex items-center space-x-2">
                          <Checkbox
                            id={rarity}
                            checked={selectedRarities.includes(rarity)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRarities([...selectedRarities, rarity])
                              } else {
                                setSelectedRarities(selectedRarities.filter((r) => r !== rarity))
                              }
                            }}
                          />
                          <Label htmlFor={rarity} className="text-sm capitalize cursor-pointer">
                            {rarity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lifecycle Stage */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Lifecycle Stage</Label>
                    <div className="space-y-2">
                      {lifecycleStages.map((stage) => (
                        <div key={stage} className="flex items-center space-x-2">
                          <Checkbox
                            id={stage}
                            checked={selectedStages.includes(stage)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStages([...selectedStages, stage])
                              } else {
                                setSelectedStages(selectedStages.filter((s) => s !== stage))
                              }
                            }}
                          />
                          <Label htmlFor={stage} className="text-sm capitalize cursor-pointer">
                            {stage}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range: {priceRange[0]} - {priceRange[1]} OCT
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedRarities([])
                    setSelectedStages([])
                    setPriceRange([0, 100])
                    setSearchQuery("")
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* NFT Grid/List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {filteredAndSortedNFTs.length} NFT{filteredAndSortedNFTs.length !== 1 ? "s" : ""} found
              </p>
              {!isConnected && (
                <Button onClick={() => toast({ title: "Connect your wallet to interact with NFTs" })} variant="outline">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedNFTs.map((nft) => {
                  const stageInfo = getStageInfo(nft.lifecycleStage)
                  const StageIcon = stageInfo.icon
                  return (
                    <Card
                      key={nft.id}
                      className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
                    >
                      <div className="relative">
                        <img
                          src={nft.imageUrl || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-white text-xs font-bold ${getRarityColor(nft.rarity)}`}>
                          {nft.rarity.toUpperCase()}
                        </div>
                        <div className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-medium ${stageInfo.color}`}>
                          <StageIcon className="h-3 w-3" />
                          {stageInfo.label}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-sm">
                          <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full backdrop-blur-sm">
                            <Eye className="h-3 w-3" />
                            <span>1.2k</span>
                          </div>
                          {nft.price && (
                            <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full backdrop-blur-sm">
                              <TrendingUp className="h-3 w-3" />
                              <span>+12%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-1">{nft.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{nft.attributes.series}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {nft.category}
                          </Badge>
                          {nft.price && (
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Price</div>
                              <div className="text-lg font-bold text-primary">{nft.price} OCT</div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            asChild
                            onClick={() => setSelectedNFT(nft)}
                          >
                            <Link href={`/marketplace/${nft.id}`}>View Details</Link>
                          </Button>
                          {nft.isListed && nft.price && (
                            <Button
                              variant="default"
                              className="bg-gradient-to-r from-primary to-purple-600"
                              onClick={() => {
                                setSelectedNFT(nft)
                                setShowBuyDialog(true)
                              }}
                            >
                              <ShoppingBag className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedNFTs.map((nft) => {
                  const stageInfo = getStageInfo(nft.lifecycleStage)
                  const StageIcon = stageInfo.icon
                  return (
                    <Card key={nft.id} className="hover:shadow-xl transition-shadow border-2">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <img
                              src={nft.imageUrl || "/placeholder.svg"}
                              alt={nft.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className={`absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium ${stageInfo.color}`}>
                              <StageIcon className="h-3 w-3" />
                              {stageInfo.label}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold">{nft.name}</h3>
                                <p className="text-muted-foreground">{nft.attributes.series}</p>
                              </div>
                              {nft.price && (
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground">Price</div>
                                  <div className="text-xl font-bold text-primary">{nft.price} OCT</div>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{nft.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{nft.category}</Badge>
                                <Badge className={getRarityColor(nft.rarity)}>{nft.rarity}</Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>Minted {new Date(nft.mintedDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                  <Link href={`/marketplace/${nft.id}`}>View Details</Link>
                                </Button>
                                {nft.isListed && nft.price && (
                                  <Button
                                    className="bg-gradient-to-r from-primary to-purple-600"
                                    onClick={() => {
                                      setSelectedNFT(nft)
                                      setShowBuyDialog(true)
                                    }}
                                  >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Buy Now
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {filteredAndSortedNFTs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No NFTs Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters to find more results.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategories([])
                    setSelectedRarities([])
                    setSelectedStages([])
                    setPriceRange([0, 100])
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </div>

      {/* Mint Dialog */}
      <Dialog open={showMintDialog} onOpenChange={setShowMintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mint New NFT</DialogTitle>
            <DialogDescription>
              Create a new anime merchandise NFT on the blockchain. This will cost a small gas fee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To mint an NFT, please use the Create page to upload your merchandise details and images.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMintDialog(false)}>
              Cancel
            </Button>
            <Button asChild>
              <Link href="/create">Go to Create Page</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase NFT</DialogTitle>
            <DialogDescription>
              Complete your purchase of {selectedNFT?.name} for {selectedNFT?.price} OCT
            </DialogDescription>
          </DialogHeader>
          {selectedNFT && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  src={selectedNFT.imageUrl || "/placeholder.svg"}
                  alt={selectedNFT.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedNFT.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedNFT.attributes.series}</p>
                  <div className="text-lg font-bold text-primary mt-1">{selectedNFT.price} OCT</div>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{selectedNFT.price} OCT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                  <span className="font-medium">{(selectedNFT.price * 0.025).toFixed(2)} OCT</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">
                    {(selectedNFT.price * 1.025).toFixed(2)} OCT
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuyDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={() => handleBuy(selectedNFT)} disabled={isProcessing || !isConnected}>
              {isProcessing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Confirm Purchase
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
