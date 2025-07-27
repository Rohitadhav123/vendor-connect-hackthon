"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Store, Star, MapPin, Shield, Truck } from "lucide-react"

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<"vendor" | "supplier" | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VendorConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50"></div>
        <div className="absolute top-10 right-10 opacity-10">
          <div className="w-64 h-64 rounded-full bg-orange-200"></div>
        </div>
        <div className="absolute bottom-10 left-10 opacity-10">
          <div className="w-48 h-48 rounded-full bg-red-200"></div>
        </div>

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-3 gap-4 opacity-20">
              <img src="/placeholder.svg?height=80&width=80" alt="" className="w-20 h-20 rounded-full object-cover" />
              <img src="/placeholder.svg?height=80&width=80" alt="" className="w-20 h-20 rounded-full object-cover" />
              <img src="/placeholder.svg?height=80&width=80" alt="" className="w-20 h-20 rounded-full object-cover" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect Street Food Vendors with <span className="text-orange-500">Trusted Suppliers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A seamless digital platform that solves raw material sourcing challenges for street food vendors across
            India. Get quality ingredients at competitive prices with verified suppliers.
          </p>

          {/* Role Selection Cards with better visuals */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <Card
              className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                selectedRole === "vendor"
                  ? "ring-2 ring-orange-500 bg-gradient-to-br from-orange-50 to-orange-100"
                  : "bg-white hover:bg-orange-50"
              }`}
              onClick={() => setSelectedRole("vendor")}
            >
              <CardHeader className="text-center p-8">
                <div className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ShoppingCart className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">🍛</span>
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">I'm a Food Vendor</CardTitle>
                <CardDescription className="text-gray-600">
                  Looking for quality raw materials at competitive prices
                </CardDescription>
                <div className="mt-4 text-sm text-orange-600 font-medium">Join 10,000+ vendors</div>
              </CardHeader>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                selectedRole === "supplier"
                  ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100"
                  : "bg-white hover:bg-blue-50"
              }`}
              onClick={() => setSelectedRole("supplier")}
            >
              <CardHeader className="text-center p-8">
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Store className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">🥬</span>
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">I'm a Supplier</CardTitle>
                <CardDescription className="text-gray-600">Want to sell raw materials to food vendors</CardDescription>
                <div className="mt-4 text-sm text-blue-600 font-medium">Join 5,000+ suppliers</div>
              </CardHeader>
            </Card>
          </div>

          {selectedRole && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-4 duration-500">
              <Link href={`/signup?role=${selectedRole}`}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started as {selectedRole === "vendor" ? "Vendor" : "Supplier"}
                </Button>
              </Link>
              <Link href={`/login?role=${selectedRole}`}>
                <Button size="lg" variant="outline" className="border-2 hover:bg-gray-50 bg-transparent">
                  Already have an account?
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose VendorConnect?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built specifically for the Indian street food ecosystem with features that address real challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Shield className="w-10 h-10 text-green-600" />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt=""
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Suppliers</h3>
              <p className="text-gray-600">All suppliers are verified with business credentials and quality checks</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <MapPin className="w-10 h-10 text-blue-600" />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt=""
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
              <p className="text-gray-600">Find suppliers near you for faster delivery and lower costs</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Star className="w-10 h-10 text-purple-600" />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt=""
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust & Ratings</h3>
              <p className="text-gray-600">Transparent ratings and reviews from real vendors</p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Truck className="w-10 h-10 text-orange-600" />
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt=""
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your orders from placement to delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">10,000+</div>
              <div className="text-gray-600">Active Vendors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">5,000+</div>
              <div className="text-gray-600">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">1M+</div>
              <div className="text-gray-600">Orders Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of vendors and suppliers already using VendorConnect</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VendorConnect</span>
              </div>
              <p className="text-gray-400">Connecting street food vendors with trusted suppliers across India.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/vendor/browse" className="hover:text-white">
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link href="/vendor/orders" className="hover:text-white">
                    Track Orders
                  </Link>
                </li>
                <li>
                  <Link href="/vendor/suppliers" className="hover:text-white">
                    Find Suppliers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/supplier/products" className="hover:text-white">
                    Manage Products
                  </Link>
                </li>
                <li>
                  <Link href="/supplier/orders" className="hover:text-white">
                    View Orders
                  </Link>
                </li>
                <li>
                  <Link href="/supplier/analytics" className="hover:text-white">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VendorConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
