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
  Store,
  Package,
  TrendingUp,
  Users,
  Bell,
  User,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import ProductList from "@/components/shared/product-list"

export default function SupplierDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
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
      console.log('🚫 SUPPLIER DASHBOARD: No authenticated user, redirecting to login')
      router.push('/login')
    } else if (user) {
      console.log('✅ SUPPLIER DASHBOARD: User authenticated:', user.name)
      // Ensure supplier role
      if (user.role !== 'supplier') {
        console.log('⚠️ SUPPLIER DASHBOARD: User is not a supplier, redirecting to appropriate dashboard')
        router.push(user.role === 'vendor' ? '/vendor/dashboard' : '/login')
      }
    }
  }, [user, router, isLoading, isInitializing])

  // Show loading while auth context initializes
  if (isLoading || isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
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

  // Mock data
  const stats = {
    totalProducts: 45,
    activeOrders: 12,
    monthlyRevenue: 45600,
    totalCustomers: 89,
  }

  const recentOrders = [
    {
      id: "ORD001",
      vendor: "Raj's Street Food",
      items: "Onions (10kg), Tomatoes (5kg)",
      amount: "₹450",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "ORD002",
      vendor: "Sharma Chaat Corner",
      items: "Red Chili Powder (2kg)",
      amount: "₹360",
      status: "confirmed",
      date: "2024-01-14",
    },
    {
      id: "ORD003",
      vendor: "Delhi Food Cart",
      items: "Cooking Oil (5L)",
      amount: "₹600",
      status: "delivered",
      date: "2024-01-13",
    },
  ]

  const products = [
    {
      id: 1,
      name: "Fresh Onions",
      category: "Vegetables",
      price: "₹25/kg",
      stock: "500 kg",
      status: "active",
      orders: 23,
      rating: 4.5,
    },
    {
      id: 2,
      name: "Red Chili Powder",
      category: "Spices",
      price: "₹180/kg",
      stock: "50 kg",
      status: "active",
      orders: 15,
      rating: 4.6,
    },
    {
      id: 3,
      name: "Basmati Rice",
      category: "Grains",
      price: "₹85/kg",
      stock: "200 kg",
      status: "active",
      orders: 31,
      rating: 4.8,
    },
    {
      id: 4,
      name: "Cooking Oil",
      category: "Oil",
      price: "₹120/L",
      stock: "0 L",
      status: "out-of-stock",
      orders: 8,
      rating: 4.3,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "out-of-stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">VendorConnect</span>
              </Link>
              <Badge variant="secondary">Supplier Dashboard</Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials(user.name)}</AvatarFallback>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-gray-600">Manage your products and orders from your supplier dashboard</p>
            </div>
            <Link href="/supplier/products/add">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrders}</div>
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">+7 new this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from vendors</CardDescription>
                </div>
                <Link href="/supplier/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{order.vendor}</p>
                      <p className="text-xs text-gray-500 mb-2">{order.items}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{order.amount}</span>
                        <span className="text-xs text-gray-500">{order.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>Manage your product inventory</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                        </TableCell>
                        <TableCell>{product.orders}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Products Section */}
        <div className="mt-8">
          <ProductList userRole="supplier" userId={user.id} />
        </div>
      </div>
    </div>
  )
}
