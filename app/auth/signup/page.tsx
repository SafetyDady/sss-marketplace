'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/firebase'

/*
  File: /app/auth/signup/page.tsx
  Version: 1.0 | 2025-06-01
  Note: หน้า Sign Up เชื่อม Firebase Auth และเพิ่ม user profile (role = user) ใน Firestore
*/

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // เพิ่ม user profile ใน Firestore (default role = user)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        role: 'user',
      })
      router.push('/auth/signin')
    } catch (err: any) {
      setError('สมัครสมาชิกไม่สำเร็จ (อีเมลอาจมีผู้ใช้งานแล้ว)')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-sm bg-white rounded-xl shadow p-8 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">สมัครสมาชิก</h2>
        <input
          className="border rounded px-3 py-2"
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          type="password"
          placeholder="ยืนยันรหัสผ่าน"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
        </button>
      </form>
    </div>
  )
}
