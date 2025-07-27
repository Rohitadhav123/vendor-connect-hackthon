"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'vendor' | 'supplier'
  businessName: string
  city?: string
  state?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: 'vendor' | 'supplier') => Promise<boolean>
  signup: (userData: SignupData) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

interface SignupData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  businessName: string
  address: string
  city: string
  state: string
  pincode: string
  businessType: string
  description?: string
  role: 'vendor' | 'supplier'
  agreeToTerms: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = async (email: string, password: string, role: 'vendor' | 'supplier'): Promise<boolean> => {
    console.log('🔐 AUTH CONTEXT: Starting login process')
    setIsLoading(true)
    
    try {
      console.log('📡 AUTH CONTEXT: Making API call to /api/auth/login')
      console.log('📦 AUTH CONTEXT: Sending data:', { email, role, password: '[HIDDEN]' })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      })

      console.log('📨 AUTH CONTEXT: Response status:', response.status)
      console.log('📨 AUTH CONTEXT: Response ok:', response.ok)
      
      const data = await response.json()
      console.log('📋 AUTH CONTEXT: Response data:', data)

      if (response.ok) {
        console.log('✅ AUTH CONTEXT: Login successful, storing user data')
        
        // Store token and user data in both localStorage and cookies
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Also store in cookies for middleware access
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
        
        setUser(data.user)
        
        console.log('💾 AUTH CONTEXT: User data stored in localStorage and cookies')
        console.log('👤 AUTH CONTEXT: User state updated:', data.user)
        
        toast.success(`Welcome back, ${data.user.name}!`)
        console.log('✅ AUTH CONTEXT: Returning true for successful login')
        return true
      } else {
        console.log('❌ AUTH CONTEXT: Login failed with error:', data.error)
        toast.error(data.error || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('❌ AUTH CONTEXT: Login error:', error)
      toast.error('Network error. Please try again.')
      return false
    } finally {
      console.log('🏁 AUTH CONTEXT: Login process completed, setting loading to false')
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData): Promise<boolean> => {
    console.log('🔐 AUTH CONTEXT: Starting signup process')
    setIsLoading(true)
    
    try {
      console.log('📡 AUTH CONTEXT: Making API call to /api/auth/signup')
      console.log('📦 AUTH CONTEXT: Sending data:', { ...userData, password: '[HIDDEN]' })
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      console.log('📨 AUTH CONTEXT: Response status:', response.status)
      console.log('📨 AUTH CONTEXT: Response ok:', response.ok)
      
      const data = await response.json()
      console.log('📋 AUTH CONTEXT: Response data:', data)

      if (response.ok) {
        console.log('✅ AUTH CONTEXT: Signup successful, storing user data')
        
        // Store token and user data in both localStorage and cookies
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Also store in cookies for middleware access
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
        
        setUser(data.user)
        
        console.log('💾 AUTH CONTEXT: User data stored in localStorage and cookies')
        console.log('👤 AUTH CONTEXT: User state updated:', data.user)
        
        toast.success(`Account created successfully! Welcome, ${data.user.name}!`)
        console.log('✅ AUTH CONTEXT: Returning true for successful signup')
        return true
      } else {
        console.log('❌ AUTH CONTEXT: Signup failed with error:', data.error)
        toast.error(data.error || 'Signup failed')
        return false
      }
    } catch (error) {
      console.error('❌ AUTH CONTEXT: Signup error:', error)
      toast.error('Network error. Please try again.')
      return false
    } finally {
      console.log('🏁 AUTH CONTEXT: Signup process completed, setting loading to false')
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Also remove from cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
