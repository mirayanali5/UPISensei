"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { apiService } from '@/lib/api-service'

export interface User {
  id: string
  email: string
  name: string
  phone: string
}

export interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, phone: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo account credentials
const DEMO_ACCOUNT = {
  email: 'demo@upisensei.com',
  password: 'demo123',
  name: 'Saad Ahmed',
  phone: '+919876543210', // Phone without spaces for API
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login - accepts demo credentials
    if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
      try {
        // Get or create user in backend using phone number
        const backendUser = await apiService.getUserByPhone(DEMO_ACCOUNT.phone)
        
        setUser({
          id: backendUser.id, // Use UUID from backend
          email: DEMO_ACCOUNT.email,
          name: backendUser.name || DEMO_ACCOUNT.name,
          phone: backendUser.phone,
        })
        return true
      } catch (error) {
        console.error('Error fetching user from backend:', error)
        // Fallback: still allow login but user won't have valid UUID
        // This allows the app to work even if backend is down
        setUser({
          id: 'demo-user-fallback',
          email: DEMO_ACCOUNT.email,
          name: DEMO_ACCOUNT.name,
          phone: DEMO_ACCOUNT.phone,
        })
        return true
      }
    }
    return false
  }

  const signup = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    // Simple signup - creates a new user
    if (email && password && name && phone) {
      try {
        // Normalize phone number (remove spaces, ensure +91 prefix)
        const normalizedPhone = phone.replace(/\s/g, '').startsWith('+91') 
          ? phone.replace(/\s/g, '') 
          : `+91${phone.replace(/\s/g, '')}`
        
        // Get or create user in backend
        const backendUser = await apiService.getUserByPhone(normalizedPhone)
        
        setUser({
          id: backendUser.id, // Use UUID from backend
          email,
          name: backendUser.name || name,
          phone: backendUser.phone,
        })
        return true
      } catch (error) {
        console.error('Error creating user in backend:', error)
        // Fallback: create local user
        setUser({
          id: `user_${Date.now()}`,
          email,
          name,
          phone,
        })
        return true
      }
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
