'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

/*
  File: /app/auth/signin/page.tsx
  Version: 3.1 | 2025-06-01
  Note: Sign In (email/password + Google + Facebook + LINE)
        แจ้งเตือนบัญชีซ้ำ (Google/Facebook) อย่างชัดเจน
*/

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Social Provider
  const googleProvider = new GoogleAuthProvider()
  const facebookProvider = new FacebookAuthProvider()

  // Common Profile Logic
  const handleProfileAfterSocialLogin = async (user: any) => {
    const userRef = doc(db, 'users', user.uid)
    const snap = await getDoc(userRef)
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        role: 'user',
      })
    }
    router.push('/')
  }

  // Google Login
  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await handleProfileAfterSocialLogin(result.user)
    } catch (err: any) {
      setError('เข้าสู่ระบบด้วย Google ไม่สำเร็จ')
    }
    setLoading(false)
  }

  // Facebook Login (ตรวจสอบบัญชีซ้ำ)
  const handleFacebookLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      await handleProfileAfterSocialLogin(result.user)
    } catch (err: any) {
      // ตรวจสอบ error บัญชีซ้ำ Google/Facebook
      if (
        err.code === 'auth/account-exists-with-different-credential' ||
        (err.customData && err.customData._tokenResponse && err.customData._tokenResponse.needConfirmation)
      ) {
        setError(
          'บัญชีนี้สมัครผ่าน Google แล้ว กรุณาเข้าสู่ระบบด้วย Google หรือเชื่อมบัญชี Facebook ในหน้าตั้งค่า'
        )
      } else {
        setError('เข้าสู่ระบบด้วย Facebook ไม่สำเร็จ')
      }
    }
    setLoading(false)
  }

  // LINE Login
  const handleLineLogin = () => {
    const lineClientId = "2007212106"
    const redirectUri = encodeURIComponent("http://localhost:3000/auth/line-callback")
    const state = Math.random().toString(36).substring(2)
    const scope = "profile openid email"
    window.location.href =
      `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineClientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`
  }

  // Email/Password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (err: any) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-sm bg-white rounded-xl shadow p-8 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">เข้าสู่ระบบ</h2>
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
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        <div className="my-2 text-center text-gray-500 text-sm">หรือเข้าสู่ระบบด้วย</div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-white border border-gray-400 text-gray-800 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100"
          disabled={loading}
        >
          <img src="/images/google.svg" alt="Google" className="w-5 h-5" />
          Google
        </button>
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-800"
          disabled={loading}
        >
          <img src="/images/facebook.svg" alt="Facebook" className="w-5 h-5" />
          Facebook
        </button>
        <button
          type="button"
          onClick={handleLineLogin}
          className="bg-green-500 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-600"
          disabled={loading}
        >
          <img src="/images/line.svg" alt="Line" className="w-5 h-5" />
          Line
        </button>
      </form>
    </div>
  )
}
