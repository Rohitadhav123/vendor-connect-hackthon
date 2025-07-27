"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Search, Filter, Package, Truck, Clock, CheckCircle, MapPin, Phone, Star, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VendorOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const orders = [
    {
      id: "ORD001",
      supplier: {
        name: "Fresh Vegetables Co.",
        rating: 4.5,
        phone: "+91 98765 43210",
        location: "Azadpur Mandi, Delhi",
      },
      items: [
        { name: "Fresh Onions", quantity: "10 kg", price: "₹250" },
        { name: "Tomatoes", quantity: "5 kg", price: "₹200" },
      ],
      totalAmount: "₹450",
      status: "delivered",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-16",
      trackingId: "TRK001",
    },
    {
      id: "ORD002",
      supplier: {
        name: "Spice Masters",
        rating: 4.8,
        phone: "+91 87654 32109",
        location: "Khari Baoli, Delhi",
      },
      items: [
        { name: "Turmeric Powder", quantity: "1 kg", price: "₹180" },
        { name: "Red Chili Powder", quantity: "2 kg", price: "₹360" },
      ],
      totalAmount: "₹540",
      status: "in-transit",
      orderDate: "2024-01-14",
      expectedDelivery: "2024-01-16",
      trackingId: "TRK002",
    },
    {
      id: "ORD003",
      supplier: {
        name: "Oil Distributors",
        rating: 4.3,
        phone: "+91 76543 21098",
        location: "Mandoli, Delhi",
      },
      items: [
        { name: "Mustard Oil", quantity: "5 L", price: "₹600" },
        { name: "Sunflower Oil", quantity: "3 L", price: "₹360" },
      ],
      totalAmount: "₹960",
      status: "pending",
      orderDate: "2024-01-13",
      expectedDelivery: "2024-01-17",
      trackingId: "TRK003",
    },
    {
      id: "ORD004",
      supplier: {
        name: "Grain Masters",
        rating: 4.6,
        phone: "+91 65432 10987",
        location: "Najafgarh, Delhi",
      },
      items: [
        { name: "Basmati Rice", quantity: "25 kg", price: "₹2125" },
        { name: "Wheat Flour", quantity: "10 kg", price: "₹300" },
      ],
      totalAmount: "₹2425",
      status: "confirmed",
      orderDate: "2024-01-12",
      expectedDelivery: "2024-01-15",
      trackingId: "TRK004",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "in-transit":
        return <Truck className="w-4 h-4" />
      case "confirmed":
        return <Package className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/vendor/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders or suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <CardDescription>
                        Ordered on {new Date(order.orderDate).toLocaleDateString("en-IN")}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Supplier Info */}
                  <div>
                    <h4 className="font-semibold mb-3">Supplier Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {order.supplier.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{order.supplier.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{order.supplier.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{order.supplier.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{order.supplier.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-600">{item.quantity}</p>
                          </div>
                          <span className="font-medium">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-semibold mb-3">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-lg">{order.totalAmount}</span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Tracking ID:</span>
                        <span className="font-mono">{order.trackingId}</span>
                      </div>

                      {order.status === "delivered" ? (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Delivered on:</span>
                          <span>{new Date(order.deliveryDate).toLocaleDateString("en-IN")}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Expected delivery:</span>
                          <span>{new Date(order.expectedDelivery).toLocaleDateString("en-IN")}</span>
                        </div>
                      )}
                    </div>

                    {order.status === "delivered" && (
                      <div className="mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Rate & Review
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't placed any orders yet"}
              </p>
              <Link href="/vendor/browse">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
