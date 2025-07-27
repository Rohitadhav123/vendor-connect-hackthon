"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  ShoppingCart,
  Star,
  MapPin,
  Bell,
  User,
  Settings,
  LogOut,
  TrendingUp,
  Filter,
  Heart,
  Package,
  Eye,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export default function VendorDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Add delay to allow auth context to initialize
    const timer = setTimeout(() => {
      setIsInitializing(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Only redirect if not loading and not initializing and no user
    if (!isLoading && !isInitializing && !user) {
      console.log('🚫 VENDOR DASHBOARD: No authenticated user, redirecting to login')
      router.push('/login')
    } else if (user) {
      console.log('✅ VENDOR DASHBOARD: User authenticated:', user.name)
      // Ensure vendor role
      if (user.role !== 'vendor') {
        console.log('⚠️ VENDOR DASHBOARD: User is not a vendor, redirecting to appropriate dashboard')
        router.push(user.role === 'supplier' ? '/supplier/dashboard' : '/login')
      }
    }
  }, [user, router, isLoading, isInitializing])

  // Show loading while auth context initializes
  if (isLoading || isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show loading if no user yet (but still initializing)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Mock data with enhanced information
  const recentOrders = [
    {
      id: "ORD001",
      supplier: "Fresh Vegetables Co.",
      items: "Onions, Tomatoes",
      amount: "₹450",
      status: "delivered",
      date: "2024-01-15",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "ORD002",
      supplier: "Spice Masters",
      items: "Turmeric, Red Chili",
      amount: "₹320",
      status: "in-transit",
      date: "2024-01-14",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "ORD003",
      supplier: "Oil Distributors",
      items: "Cooking Oil",
      amount: "₹800",
      status: "pending",
      date: "2024-01-13",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Fresh Onions",
      supplier: "Vegetable Hub",
      price: "₹25/kg",
      originalPrice: "₹30/kg",
      rating: 4.5,
      reviews: 128,
      location: "2.5 km away",
      image: "/placeholder.svg?height=120&width=120",
      inStock: true,
      discount: "17% off",
      category: "Vegetables",
      freshness: "Farm Fresh",
    },
    {
      id: 2,
      name: "Premium Basmati Rice",
      supplier: "Grain Masters",
      price: "₹85/kg",
      originalPrice: "₹95/kg",
      rating: 4.8,
      reviews: 89,
      location: "1.8 km away",
      image: "/placeholder.svg?height=120&width=120",
      inStock: true,
      discount: "11% off",
      category: "Grains",
      freshness: "Premium Quality",
    },
    {
      id: 3,
      name: "Red Chili Powder",
      supplier: "Spice World",
      price: "₹180/kg",
      originalPrice: "₹200/kg",
      rating: 4.6,
      reviews: 156,
      location: "3.2 km away",
      image: "/placeholder.svg?height=120&width=120",
      inStock: true,
      discount: "10% off",
      category: "Spices",
      freshness: "Pure & Natural",
    },
    {
      id: 4,
      name: "Mustard Cooking Oil",
      supplier: "Oil Express",
      price: "₹120/L",
      originalPrice: "₹130/L",
      rating: 4.3,
      reviews: 203,
      location: "4.1 km away",
      image: "/placeholder.svg?height=120&width=120",
      inStock: false,
      discount: "8% off",
      category: "Oil",
      freshness: "Cold Pressed",
    },
  ]

  const categories = [
    { id: "all", name: "All Categories", count: 150, icon: "", color: "bg-gray-100" },
    { id: "vegetables", name: "Vegetables", count: 45, icon: "", color: "bg-green-100" },
    { id: "spices", name: "Spices", count: 32, icon: "", color: "bg-red-100" },
    { id: "grains", name: "Grains & Rice", count: 28, icon: "", color: "bg-yellow-100" },
    { id: "oil", name: "Cooking Oil", count: 15, icon: "", color: "bg-orange-100" },
    { id: "packaging", name: "Packaging", count: 30, icon: "", color: "bg-blue-100" },
  ]

  const quickStats = [
    { label: "Active Orders", value: "3", change: "+2 from yesterday", color: "text-blue-600", bgColor: "bg-blue-50" },
    {
      label: "This Month",
      value: "₹12,450",
      change: "+15% from last month",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Saved",
      value: "₹2,340",
      change: "Through smart buying",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">VendorConnect</span>
                  <div className="text-xs text-gray-500">Vendor Dashboard</div>
                </div>
              </Link>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products, suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-0 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  2
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-orange-100 text-orange-600">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.businessName}</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{stat.label}</span>
                      <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                    </div>
                    <div className="text-xs text-gray-500">{stat.change}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Categories */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-500" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all hover:scale-105 ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 shadow-md"
                          : `${category.color} hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section with Food Imagery */}
            <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 opacity-20">
                <img src="/placeholder.svg?height=200&width=200" alt="" className="w-48 h-48 object-cover" />
              </div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                <p className="text-orange-100 mb-4">
                  Ready to source the best ingredients for your delicious street food?
                </p>
                <div className="flex gap-4">
                  <Button className="bg-white text-orange-500 hover:bg-gray-100">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Start Shopping
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
                  >
                    View Orders
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Recent Orders */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Track your latest purchases</CardDescription>
                </div>
                <Link href="/vendor/orders">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 bg-transparent">
                    View All Orders
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                    >
                      <img
                        src={order.image || "/placeholder.svg"}
                        alt={order.items}
                        className="w-12 h-12 rounded-lg object-cover shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{order.supplier}</p>
                        <p className="text-sm text-gray-500">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{order.amount}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Featured Products */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Featured Products
                  </CardTitle>
                  <CardDescription>Best deals near you</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group border rounded-xl p-4 hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                          />
                          {product.discount && (
                            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs shadow-lg">
                              {product.discount}
                            </Badge>
                          )}
                          <div className="absolute -bottom-1 -left-1 bg-white rounded-full p-1 shadow-md">
                            <span className="text-xs">
                              {product.category === "Vegetables"
                                ? "🥬"
                                : product.category === "Spices"
                                  ? "🌶️"
                                  : product.category === "Grains"
                                    ? "🌾"
                                    : "🫒"}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600">{product.supplier}</p>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {product.freshness}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-red-50">
                              <Heart className="w-4 h-4 hover:text-red-500 transition-colors" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{product.location}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-green-600">{product.price}</span>
                              <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                            </div>

                            <div className="flex gap-2">
                              {product.inStock ? (
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
                                >
                                  Add to Cart
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" disabled className="opacity-50 bg-transparent">
                                  Out of Stock
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link href="/vendor/browse">
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-orange-50 hover:border-orange-200 bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View All Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
