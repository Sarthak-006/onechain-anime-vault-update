"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Plus,
  Settings,
  BarChart3,
  Grid3X3,
  List,
  Search,
  ExternalLink,
  Clock,
  Award,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ListNFTDialog } from "@/components/nft/list-nft-dialog"

// Mock user data
const mockUser = {
  address: "0x1234567890abcdef",
  username: "AnimeCollector",
  avatar: "/placeholder.svg?height=100&width=100",
  joinedAt: "2024-01-01",
  stats: {
    nftsOwned: 24,
    nftsSold: 8,
    totalVolume: 156.7,
    portfolioValue: 342.5,
    portfolioChange: "+12.3%",
    rank: 127,
  },
}

// Mock NFT collection data
const mockOwnedNFTs = [
  {
    id: "1",
    name: "Demon Slayer Tanjiro Figure",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Tanjiro+Figure",
    category: "figure",
    rarity: "rare",
    purchasePrice: 10.2,
    currentPrice: 12.5,
    change: "+22.5%",
    isListed: true,
    listedPrice: 12.5,
  },
  {
    id: "2",
    name: "Attack on Titan Survey Corps Badge",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Survey+Corps+Badge",
    category: "accessory",
    rarity: "uncommon",
    purchasePrice: 7.8,
    currentPrice: 8.3,
    change: "+6.4%",
    isListed: false,
  },
  {
    id: "3",
    name: "One Piece Luffy Gold Card",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Luffy+Gold+Card",
    category: "card",
    rarity: "legendary",
    purchasePrice: 22.0,
    currentPrice: 25.0,
    change: "+13.6%",
    isListed: true,
    listedPrice: 25.0,
  },
  {
    id: "4",
    name: "Naruto Hokage Poster",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Hokage+Poster",
    category: "poster",
    rarity: "epic",
    purchasePrice: 18.5,
    currentPrice: 15.8,
    change: "-14.6%",
    isListed: false,
  },
]

// Mock transaction history
const mockTransactions = [
  {
    id: "1",
    type: "purchase",
    nftName: "Demon Slayer Tanjiro Figure",
    price: 10.2,
    date: "2024-01-15T10:30:00Z",
    txHash: "0xabc123...",
    status: "completed",
  },
  {
    id: "2",
    type: "sale",
    nftName: "Dragon Ball Z Goku Keychain",
    price: 6.8,
    date: "2024-01-14T15:45:00Z",
    txHash: "0xdef456...",
    status: "completed",
  },
  {
    id: "3",
    type: "mint",
    nftName: "My Hero Academia Deku Nendoroid",
    price: 0.1,
    date: "2024-01-13T09:20:00Z",
    txHash: "0xghi789...",
    status: "completed",
  },
]

// Mock favorites
const mockFavorites = [
  {
    id: "5",
    name: "Spirited Away No-Face Figure",
    imageUrl: "/placeholder.svg?height=300&width=300&text=No-Face+Figure",
    currentPrice: 28.5,
    change: "+8.2%",
    rarity: "legendary",
  },
  {
    id: "6",
    name: "Pokemon Pikachu Card",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Pikachu+Card",
    currentPrice: 15.3,
    change: "-2.1%",
    rarity: "rare",
  },
]

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [listDialogOpen, setListDialogOpen] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<{ id: string; name: string } | null>(null)

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

  const getChangeColor = (change: string) => {
    return change.startsWith("+") ? "text-green-500" : "text-red-500"
  }

  const getChangeIcon = (change: string) => {
    return change.startsWith("+") ? TrendingUp : TrendingDown
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{mockUser.username}</h1>
              <p className="text-muted-foreground font-mono">{mockUser.address}</p>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(mockUser.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Create NFT
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUser.stats.portfolioValue} OCT</div>
              <div className={`text-xs flex items-center gap-1 ${getChangeColor(mockUser.stats.portfolioChange)}`}>
                {mockUser.stats.portfolioChange.startsWith("+") ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {mockUser.stats.portfolioChange} from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NFTs Owned</CardTitle>
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUser.stats.nftsOwned}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUser.stats.totalVolume} OCT</div>
              <p className="text-xs text-muted-foreground">{mockUser.stats.nftsSold} NFTs sold</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collector Rank</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{mockUser.stats.rank}</div>
              <p className="text-xs text-muted-foreground">Global ranking</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="collection">My Collection</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* My Collection Tab */}
          <TabsContent value="collection" className="mt-6">
            <div className="space-y-6">
              {/* Collection Controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search your collection..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="listed">Listed</SelectItem>
                      <SelectItem value="unlisted">Not Listed</SelectItem>
                      <SelectItem value="figure">Figures</SelectItem>
                      <SelectItem value="card">Cards</SelectItem>
                      <SelectItem value="poster">Posters</SelectItem>
                      <SelectItem value="accessory">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
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

              {/* Collection Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockOwnedNFTs.map((nft) => (
                    <Card key={nft.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <img
                          src={nft.imageUrl || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div
                          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-medium ${getRarityColor(nft.rarity)}`}
                        >
                          {nft.rarity.toUpperCase()}
                        </div>
                        {nft.isListed && <Badge className="absolute top-3 right-3 bg-green-500">Listed</Badge>}
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-1">{nft.name}</CardTitle>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Bought: {nft.purchasePrice} OCT</span>
                          <div className={`flex items-center gap-1 ${getChangeColor(nft.change)}`}>
                            {nft.change.startsWith("+") ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {nft.change}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Current Value</div>
                            <div className="text-lg font-bold text-primary">{nft.currentPrice} OCT</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {nft.isListed ? (
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Unlist
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedNFT({ id: nft.id, name: nft.name })
                                setListDialogOpen(true)
                              }}
                            >
                              List for Sale
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/marketplace/${nft.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockOwnedNFTs.map((nft) => (
                    <Card key={nft.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <img
                              src={nft.imageUrl || "/placeholder.svg"}
                              alt={nft.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div
                              className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-white text-xs font-medium ${getRarityColor(nft.rarity)}`}
                            >
                              {nft.rarity.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold">{nft.name}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{nft.category}</Badge>
                                  {nft.isListed && <Badge className="bg-green-500">Listed</Badge>}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">Current Value</div>
                                <div className="text-xl font-bold text-primary">{nft.currentPrice} OCT</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">Bought: {nft.purchasePrice} OCT</span>
                                <div className={`flex items-center gap-1 ${getChangeColor(nft.change)}`}>
                                  {nft.change.startsWith("+") ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  {nft.change}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {nft.isListed ? (
                                  <Button variant="outline" size="sm" className="bg-transparent">
                                    Unlist
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedNFT({ id: nft.id, name: nft.name })
                                      setListDialogOpen(true)
                                    }}
                                  >
                                    List for Sale
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/marketplace/${nft.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your complete trading and minting history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {tx.type === "purchase" && <TrendingDown className="h-5 w-5 text-red-500" />}
                        {tx.type === "sale" && <TrendingUp className="h-5 w-5 text-green-500" />}
                        {tx.type === "mint" && <Plus className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium capitalize">{tx.type}</span>
                          <span className="font-bold">{tx.price} OCT</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="mb-1">{tx.nftName}</div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(tx.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={tx.status === "completed" ? "default" : "secondary"}>{tx.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Watchlist</h2>
                  <p className="text-muted-foreground">NFTs you're interested in</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockFavorites.map((nft) => (
                  <Card key={nft.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img
                        src={nft.imageUrl || "/placeholder.svg"}
                        alt={nft.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-medium ${getRarityColor(nft.rarity)}`}
                      >
                        {nft.rarity.toUpperCase()}
                      </div>
                      <Button size="sm" variant="secondary" className="absolute top-3 right-3 h-8 w-8 p-0 text-red-500">
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-1">{nft.name}</CardTitle>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-primary">{nft.currentPrice} OCT</div>
                        <div className={`flex items-center gap-1 text-sm ${getChangeColor(nft.change)}`}>
                          {nft.change.startsWith("+") ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {nft.change}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full" asChild>
                        <Link href={`/marketplace/${nft.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Your collection value over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                      <p>Portfolio chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Breakdown</CardTitle>
                  <CardDescription>Distribution by category and rarity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Figures</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Cards</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Posters</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Accessories</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Market Activity</CardTitle>
                  <CardDescription>Latest trends in your collection categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Demon Slayer figures trending up</span>
                      </div>
                      <div className="text-green-500 font-medium">+18.5%</div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>One Piece cards stable</span>
                      </div>
                      <div className="text-blue-500 font-medium">+2.1%</div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Attack on Titan accessories declining</span>
                      </div>
                      <div className="text-red-500 font-medium">-5.3%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* List NFT Dialog */}
        {selectedNFT && (
          <ListNFTDialog
            open={listDialogOpen}
            onOpenChange={setListDialogOpen}
            nftId={selectedNFT.id}
            nftName={selectedNFT.name}
          />
        )}
      </div>
    </div>
  )
}
