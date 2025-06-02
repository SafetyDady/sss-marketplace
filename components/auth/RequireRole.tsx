'use client'
import { ReactNode } from 'react'
import { useAuth } from './AuthProvider'

/*
  File: /components/auth/RequireRole.tsx
  Version: 1.0 | 2025-06-01
  Note: ใช้กับ page/component ที่ต้องการป้องกันเฉพาะ role/marketId (RBAC Guard)
*/

interface Props {
  role: 'system-admin' | 'marketplace-admin' | 'vendor' | 'partner' | 'user'
  marketId?: string
  children: ReactNode
  fallback?: ReactNode
}

export default function RequireRole({ role, marketId, children, fallback = null }: Props) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return fallback

  if (user.role === 'system-admin') return <>{children}</>
  if (user.role === role) {
    if (role === 'marketplace-admin' && marketId) {
      if (user.marketId === marketId) return <>{children}</>
      return fallback
    }
    return <>{children}</>
  }
  return fallback
}
