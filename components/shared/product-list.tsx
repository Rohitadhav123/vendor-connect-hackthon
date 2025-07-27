"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Filter, Package, MapPin, Star, ShoppingCart, Eye, Plus, Minus } from "lucide-react"
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [orderNotes, setOrderNotes] = useState('')

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

  const handlePlaceOrder = async () => {
    if (!selectedProduct || !userId) {
      toast.error('Unable to place order. Please try again.')
      return
    }

    setIsPlacingOrder(true)
    
    try {
      // Validate delivery address
      if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
        toast.error('Please fill in all delivery address fields')
        return
      }

      // Create order object
      const orderData = {
        productId: selectedProduct.id,
        quantity: orderQuantity,
        deliveryAddress,
        notes: orderNotes
      }

      // Get auth token from localStorage or context
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast.error('Authentication required. Please log in again.')
        return
      }

      // API call to place order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Order placed successfully! Order ID: ${result.order?.orderId || 'N/A'}`)
        setIsOrderDialogOpen(false)
        setSelectedProduct(null)
        setOrderQuantity(1)
        setDeliveryAddress({ address: '', city: '', state: '', pincode: '' })
        setOrderNotes('')
        
        // Trigger a refresh of the vendor dashboard to show the new order
        window.dispatchEvent(new CustomEvent('orderPlaced', { detail: result.order }))
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
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
                          <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setSelectedProduct(product)
                                  setOrderQuantity(product.minOrderQuantity)
                                }}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Order Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Place Order</DialogTitle>
                                <DialogDescription>
                                  Order {selectedProduct?.name} from {selectedProduct?.supplierBusinessName}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedProduct && (
                                <div className="grid gap-4 py-4">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={selectedProduct.images?.[0] || "/placeholder.svg"}
                                      alt={selectedProduct.name}
                                      className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                      <h3 className="font-semibold">{selectedProduct.name}</h3>
                                      <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                                      <p className="font-bold text-green-600">
                                        {formatPrice(selectedProduct.price, selectedProduct.unit)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="quantity" className="text-right">
                                      Quantity
                                    </Label>
                                    <div className="col-span-3 flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setOrderQuantity(Math.max(selectedProduct.minOrderQuantity, orderQuantity - 1))}
                                        disabled={orderQuantity <= selectedProduct.minOrderQuantity}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <Input
                                        id="quantity"
                                        type="number"
                                        value={orderQuantity}
                                        onChange={(e) => setOrderQuantity(Math.max(selectedProduct.minOrderQuantity, parseInt(e.target.value) || selectedProduct.minOrderQuantity))}
                                        className="text-center h-8 w-20"
                                        min={selectedProduct.minOrderQuantity}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setOrderQuantity(orderQuantity + 1)}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                      <span className="text-sm text-gray-500 ml-2">{selectedProduct.unit}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="text-sm text-gray-600">
                                    <p>Minimum order: {selectedProduct.minOrderQuantity} {selectedProduct.unit}</p>
                                  </div>
                                  
                                  {/* Delivery Address Section */}
                                  <div className="space-y-4 border-t pt-4">
                                    <h4 className="font-semibold text-sm">Delivery Address</h4>
                                    <div className="grid gap-3">
                                      <div>
                                        <Label htmlFor="address" className="text-sm">Street Address</Label>
                                        <Input
                                          id="address"
                                          placeholder="Enter your street address"
                                          value={deliveryAddress.address}
                                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, address: e.target.value }))}
                                          className="mt-1"
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label htmlFor="city" className="text-sm">City</Label>
                                          <Input
                                            id="city"
                                            placeholder="City"
                                            value={deliveryAddress.city}
                                            onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                                            className="mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="state" className="text-sm">State</Label>
                                          <Input
                                            id="state"
                                            placeholder="State"
                                            value={deliveryAddress.state}
                                            onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                                            className="mt-1"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <Label htmlFor="pincode" className="text-sm">Pincode</Label>
                                        <Input
                                          id="pincode"
                                          placeholder="Pincode"
                                          value={deliveryAddress.pincode}
                                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, pincode: e.target.value }))}
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Notes Section */}
                                  <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-sm">Order Notes (Optional)</Label>
                                    <Input
                                      id="notes"
                                      placeholder="Any special instructions or notes"
                                      value={orderNotes}
                                      onChange={(e) => setOrderNotes(e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                      <span className="font-semibold">Total Amount:</span>
                                      <span className="font-bold text-lg text-green-600">
                                        ₹{(selectedProduct.price * orderQuantity).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setIsOrderDialogOpen(false)}
                                  disabled={isPlacingOrder}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  type="button" 
                                  onClick={handlePlaceOrder}
                                  disabled={isPlacingOrder}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
