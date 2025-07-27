"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Package, MapPin, Star, ShoppingCart, Eye } from "lucide-react"
import toast from "react-hot-toast"

interface Product {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  price: number
  minOrderQuantity: number
  unit: string
  images: string[]
  specifications: Record<string, any>
  supplierId: string
  supplierName: string
  supplierBusinessName: string
  location: { city: string; state: string }
  city: string
  state: string
  isActive: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface ProductListProps {
  userRole: 'vendor' | 'supplier'
  userId?: string
}

export default function ProductList({ userRole, userId }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "vegetables", label: "Vegetables" },
    { value: "fruits", label: "Fruits" },
    { value: "grains", label: "Grains & Rice" },
    { value: "spices", label: "Spices" },
    { value: "oil", label: "Cooking Oil" },
    { value: "dairy", label: "Dairy Products" },
    { value: "packaging", label: "Packaging" }
  ]

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      console.log('🔍 Fetching products...', { searchQuery, selectedCategory, currentPage })
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }

      const response = await fetch(`/api/products/list?${params}`)
      const data = await response.json()

      if (response.ok) {
        console.log('✅ Products fetched successfully:', data.products.length)
        setProducts(data.products)
        setTotalPages(data.pagination.totalPages)
      } else {
        console.error('❌ Failed to fetch products:', data.error)
        toast.error(data.error || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchProducts()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatPrice = (price: number, unit: string) => {
    return `₹${price.toLocaleString()}/${unit}`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      vegetables: "bg-green-100 text-green-800",
      fruits: "bg-orange-100 text-orange-800",
      grains: "bg-yellow-100 text-yellow-800",
      spices: "bg-red-100 text-red-800",
      oil: "bg-amber-100 text-amber-800",
      dairy: "bg-blue-100 text-blue-800",
      packaging: "bg-purple-100 text-purple-800"
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  if (isLoading && products.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-500" />
          {userRole === 'vendor' ? 'Available Products' : 'All Products'}
        </CardTitle>
        <CardDescription>
          {userRole === 'vendor' 
            ? 'Browse and order products from suppliers' 
            : 'View all products in the marketplace'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} disabled={isLoading}>
            <Filter className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-green-600">
                          {formatPrice(product.price, product.unit)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Min: {product.minOrderQuantity} {product.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{product.location.city}, {product.location.state}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-gray-500">Supplier: </span>
                        <span className="font-medium">{product.supplierBusinessName}</span>
                      </div>
                    </div>
                    
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {userRole === 'vendor' ? (
                        <>
                          <Button size="sm" className="flex-1">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Order Now
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
