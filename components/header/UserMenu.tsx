'use client'
import { useAuth } from '../../components/auth/AuthProvider'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'

/*
  File: /components/header/UserMenu.tsx
  Revision: 2.1 | 2025-06-02
  Note: เปลี่ยน import alias "@/..." เป็น relative path, production-ready
*/

export default function UserMenu() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ปิด dropdown เมื่อคลิกนอกกรอบ
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (loading) return null

  if (!user) {
    return (
      <button
        onClick={() => router.push('/auth/signin')}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800"
      >
        เข้าสู่ระบบ
      </button>
    )
  }

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 focus:bg-gray-200"
        aria-label="Open user menu"
      >
        <img
          src={user.photoURL || '/images/user.svg'}
          alt="Profile"
          className="w-8 h-8 rounded-full border"
        />
        <span className="hidden md:inline text-gray-800 font-semibold max-w-[140px] truncate">
          {user.displayName || user.email}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow-lg z-50 animate-fade-in">
          <div className="px-4 py-3 border-b flex items-center gap-2">
            <img
              src={user.photoURL || '/images/user.svg'}
              alt="Profile"
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <div className="font-semibold text-gray-900 truncate">{user.displayName || 'ผู้ใช้ใหม่'}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={async () => {
              setOpen(false)
              await signOut(auth)
              router.push('/auth/signin')
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
          >
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  )
}
