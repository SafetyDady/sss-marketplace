'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
// เปลี่ยน import alias '@/firebase/firebase' เป็น '../../firebase/firebase'
import { auth, db } from '../../firebase/firebase'

/*
  File: /components/auth/AuthProvider.tsx
  Revision: 1.1 | 2025-06-02
  Note: เปลี่ยน import alias "@/firebase/firebase" เป็น relative path, production-ready
*/

interface UserProfile {
  uid: string
  email: string
  role: 'system-admin' | 'marketplace-admin' | 'vendor' | 'partner' | 'user'
  marketId?: string
}

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // โหลด profile/role จาก Firestore
        const docRef = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            ...snap.data(),
          } as UserProfile)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
