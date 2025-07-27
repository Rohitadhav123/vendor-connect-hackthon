"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Store, ShoppingCart, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import toast from "react-hot-toast"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [role, setRole] = useState<"vendor" | "supplier">("vendor")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    businessType: "",
    description: "",
    agreeToTerms: false,
  })

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "vendor" || roleParam === "supplier") {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }
    
    console.log('🚀 Submitting signup data:', { ...formData, role, password: '[HIDDEN]' })
    
    try {
      console.log('📞 Calling signup function...')
      const success = await signup({
        ...formData,
        role
      })
      
      console.log('📋 Signup function returned:', success)
      
      if (success) {
        console.log('✅ Signup successful, determining role-based redirect')
        console.log('🔄 Current URL before redirect:', window.location.href)
        console.log('👤 SIGNUP PAGE: User role:', role)
        
        // Determine redirect URL based on role
        const redirectUrl = role === 'vendor' ? '/vendor/dashboard' : '/supplier/dashboard'
        console.log('🎯 SIGNUP PAGE: Redirecting to:', redirectUrl)
        
        // Try multiple redirect methods
        try {
          await router.push(redirectUrl)
          console.log('✅ Router.push completed to', redirectUrl)
        } catch (routerError) {
          console.error('❌ Router.push failed:', routerError)
          console.log('🔄 Trying window.location redirect...')
          window.location.href = redirectUrl
        }
      } else {
        console.log('❌ Signup returned false - registration failed')
      }
    } catch (error) {
      console.error('❌ Signup error:', error)
      toast.error('Failed to create account. Please try again.')
    }
  }

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
  ]

  const vendorBusinessTypes = [
    "Street Food Stall",
    "Food Cart",
    "Small Restaurant",
    "Tiffin Service",
    "Catering Service",
  ]

  const supplierBusinessTypes = [
    "Vegetable Wholesaler",
    "Spice Supplier",
    "Grain Dealer",
    "Oil Distributor",
    "Packaging Supplier",
    "General Food Supplier",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
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
            <CardTitle className="text-2xl">Sign up as a {role === "vendor" ? "Food Vendor" : "Supplier"}</CardTitle>
            <CardDescription>
              {role === "vendor"
                ? "Join thousands of vendors getting quality ingredients at great prices"
                : "Connect with food vendors and grow your business"}
            </CardDescription>
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
                  Food Vendor
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

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Business Information</h3>

                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder={role === "vendor" ? "e.g., Raj's Street Food" : "e.g., Fresh Vegetables Pvt Ltd"}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(role === "vendor" ? vendorBusinessTypes : supplierBusinessTypes).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Business Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter complete business address"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">
                    {role === "vendor" ? "Tell us about your food business" : "Describe your products and services"}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder={
                      role === "vendor"
                        ? "e.g., We serve North Indian street food including chaat, parathas, and beverages"
                        : "e.g., We supply fresh vegetables, spices, and packaging materials to food vendors"
                    }
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-orange-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-orange-500 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={!formData.agreeToTerms || isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href={`/login?role=${role}`} className="text-orange-500 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
