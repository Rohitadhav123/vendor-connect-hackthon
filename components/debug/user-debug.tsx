"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

export default function UserDebug() {
  const { user } = useAuth()
  const [localStorageUser, setLocalStorageUser] = useState<any>(null)
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null)

  useEffect(() => {
    // Get data from localStorage
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    console.log('🔍 DEBUG: Raw localStorage user:', storedUser)
    console.log('🔍 DEBUG: Raw localStorage token:', storedToken)
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setLocalStorageUser(parsedUser)
        console.log('🔍 DEBUG: Parsed localStorage user:', parsedUser)
      } catch (error) {
        console.error('🔍 DEBUG: Error parsing localStorage user:', error)
      }
    }
    
    setLocalStorageToken(storedToken)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 User Debug Info</h3>
      
      <div className="mb-2">
        <strong>Auth Context User:</strong>
        <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
      </div>
      
      <div className="mb-2">
        <strong>localStorage User:</strong>
        <pre className="text-xs">{JSON.stringify(localStorageUser, null, 2)}</pre>
      </div>
      
      <div>
        <strong>localStorage Token:</strong>
        <div className="text-xs">{localStorageToken ? 'Present' : 'Missing'}</div>
      </div>
    </div>
  )
}
