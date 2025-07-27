"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Search,
  Star,
  MapPin,
  Heart,
  ShoppingCart,
  Grid3X3,
  List,
  SlidersHorizontal,
  Truck,
  Shield,
} from "lucide-react"

export default function VendorBrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const products = [
    {
      id: 1,
      name: "Fresh Red Onions",
      supplier: {
        name: "Vegetable Hub",
        rating: 4.5,
        reviews: 128,
        verified: true,
        location: "Azadpur Mandi, Delhi",
        distance: "2.5 km",
      },
      price: 25,
      originalPrice: 30,
      unit: "kg",
      category: "Vegetables",
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 500,
      minimumOrder: 5,
      discount: 17,
      freshness: "Farm Fresh",
      description: "Premium quality red onions directly from farms. Perfect for all Indian cooking needs.",
      features: ["Pesticide Free", "Farm Fresh", "Grade A Quality"],
    },
    {
      id: 2,
      name: "Premium Basmati Rice",
      supplier: {
        name: "Grain Masters",
        rating: 4.8,
        reviews: 89,
        verified: true,
        location: "Najafgarh, Delhi",
        distance: "1.8 km",
      },
      price: 85,
      originalPrice: 95,
      unit: "kg",
      category: "Grains",
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 1000,
      minimumOrder: 25,
      discount: 11,
      freshness: "Premium Quality",
      description: "Aged basmati rice with long grains and aromatic fragrance. Perfect for biryanis and pulavs.",
      features: ["Aged Rice", "Long Grain", "Aromatic"],
    },
    {
      id: 3,
      name: "Pure Red Chili Powder",
      supplier: {
        name: "Spice World",
        rating: 4.6,
        reviews: 156,
        verified: true,
        location: "Khari Baoli, Delhi",
        distance: "3.2 km",
      },
      price: 180,
      originalPrice: 200,
      unit: "kg",
      category: "Spices",
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 50,
      minimumOrder: 1,
      discount: 10,
      freshness: "Pure & Natural",
      description: "Pure red chili powder made from premium quality chilies. Adds perfect heat and color to dishes.",
      features: ["No Artificial Color", "Pure Spice", "High Heat Level"],
    },
    {
      id: 4,
      name: "Cold Pressed Mustard Oil",
      supplier: {
        name: "Oil Express",
        rating: 4.3,
        reviews: 203,
        verified: true,
        location: "Mandoli, Delhi",
        distance: "4.1 km",
      },
      price: 120,
      originalPrice: 130,
      unit: "L",
      category: "Oil",
      image: "/placeholder.svg?height=200&width=200",
      inStock: false,
      stockQuantity: 0,
      minimumOrder: 5,
      discount: 8,
      freshness: "Cold Pressed",
      description: "Traditional cold-pressed mustard oil with authentic taste and aroma. Perfect for Indian cooking.",
      features: ["Cold Pressed", "Traditional Method", "Pure Mustard"],
    },
    {
      id: 5,
      name: "Fresh Tomatoes",
      supplier: {
        name: "Fresh Vegetables Co.",
        rating: 4.4,
        reviews: 95,
        verified: true,
        location: "Azadpur Mandi, Delhi",
        distance: "2.8 km",
      },
      price: 40,
      originalPrice: 45,
      unit: "kg",
      category: "Vegetables",
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 300,
      minimumOrder: 3,
      discount: 11,
      freshness: "Garden Fresh",
      description: "Ripe, juicy tomatoes perfect for curries, salads, and all cooking needs.",
      features: ["Vine Ripened", "Juicy", "Rich in Vitamins"],
    },
    {
      id: 6,
      name: "Turmeric Powder",
      supplier: {
        name: "Spice Masters",
        rating: 4.7,
        reviews: 142,
        verified: true,
        location: "Khari Baoli, Delhi",
        distance: "3.0 km",
      },
      price: 180,
      originalPrice: 190,
      unit: "kg",
      category: "Spices",
      image: "/placeholder.svg?height=200&width=200",
      inStock: true,
      stockQuantity: 100,
      minimumOrder: 1,
      discount: 5,
      freshness: "Pure & Natural",
      description: "High-quality turmeric powder with rich color and medicinal properties.",
      features: ["High Curcumin", "Pure Turmeric", "Medicinal Grade"],
    },
  ]

  const categories = [
    { id: "all", name: "All Categories", count: 150, icon: "🍽️" },
    { id: "vegetables", name: "Vegetables", count: 45, icon: "🥬" },
    { id: "spices", name: "Spices", count: 32, icon: "🌶️" },
    { id: "grains", name: "Grains & Rice", count: 28, icon: "🌾" },
    { id: "oil", name: "Cooking Oil", count: 15, icon: "🫒" },
    { id: "packaging", name: "Packaging", count: 30, icon: "📦" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  const ProductCard = ({ product }: { product: (typeof products)[0] }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <div className="relative">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {product.discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white shadow-lg">{product.discount}% OFF</Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white hover:text-red-500 transition-colors"
        >
          <Heart className="w-4 h-4" />
        </Button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
            <Badge variant="destructive" className="text-white">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
            {product.name}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {product.freshness}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
              {product.supplier.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">{product.supplier.name}</span>
              {product.supplier.verified && <Shield className="w-3 h-3 text-green-500" />}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">
                {product.supplier.rating} ({product.supplier.reviews})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{product.supplier.distance}</span>
          <Truck className="w-4 h-4 ml-2" />
          <span>Fast delivery</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              <span className="text-sm text-gray-500">/{product.unit}</span>
            </div>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              Min order: {product.minimumOrder} {product.unit}
            </div>
            <div className="text-xs text-gray-500">
              Stock: {product.stockQuantity} {product.unit}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-gray-50 bg-transparent">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/vendor/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
              <p className="text-gray-600">Find quality ingredients for your business</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-500" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Categories</label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                          selectedCategory === category.id ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{category.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="distance">Nearest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{filteredProducts.length} Products Found</h2>
                <p className="text-gray-600">
                  {selectedCategory !== "all" && `in ${categories.find((c) => c.id === selectedCategory)?.name}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      setPriceRange([0, 1000])
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
