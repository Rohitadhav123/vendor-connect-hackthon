"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Store, ShoppingCart, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import toast from "react-hot-toast"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [role, setRole] = useState<"vendor" | "supplier">("vendor")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "vendor" || roleParam === "supplier") {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }
    
    console.log('🔐 Attempting login:', { email: formData.email, role, password: '[HIDDEN]' })
    
    try {
      console.log('📞 LOGIN PAGE: Calling login function...')
      const success = await login(formData.email, formData.password, role)
      
      console.log('📋 LOGIN PAGE: Login function returned:', success)
      
      if (success) {
        console.log('✅ LOGIN PAGE: Login successful, determining role-based redirect')
        console.log('👤 LOGIN PAGE: User role:', role)
        
        // Determine redirect URL based on role
        const redirectUrl = role === 'vendor' ? '/vendor/dashboard' : '/supplier/dashboard'
        console.log('🎯 LOGIN PAGE: Redirecting to:', redirectUrl)
        
        // Simple, reliable redirect using window.location
        console.log('🔄 LOGIN PAGE: Using window.location for redirect...')
        window.location.href = redirectUrl
      } else {
        console.log('❌ LOGIN PAGE: Login returned false - authentication failed')
      }
    } catch (error) {
      console.error('❌ LOGIN PAGE: Login error:', error)
      toast.error('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VendorConnect</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {role === "vendor" ? (
                <ShoppingCart className="w-8 h-8 text-orange-500" />
              ) : (
                <Store className="w-8 h-8 text-blue-500" />
              )}
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your {role === "vendor" ? "vendor" : "supplier"} account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <Button
                  type="button"
                  variant={role === "vendor" ? "default" : "ghost"}
                  className="flex-1"
                  onClick={() => setRole("vendor")}
                >
                  Vendor
                </Button>
                <Button
                  type="button"
                  variant={role === "supplier" ? "default" : "ghost"}
                  className="flex-1"
                  onClick={() => setRole("supplier")}
                >
                  Supplier
                </Button>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href={`/signup?role=${role}`} className="text-orange-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
