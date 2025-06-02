'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/*
  File: /app/auth/line-callback/page.tsx
  Version: 1.1 | 2025-06-02
  Note: แก้ไขให้ <useSearchParams /> อยู่ใน Suspense boundary (Next.js 15+), build ผ่าน strict
*/

function LineCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams?.get('code')
    if (!code) {
      router.push('/auth/signin')
      return
    }
    // ...logic อื่น ๆ เช่น fetch token, auth callback ฯลฯ
  }, [searchParams, router])

  return (
    <div>กำลังดำเนินการเข้าสู่ระบบ...</div>
  )
}

export default function LineCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LineCallbackContent />
    </Suspense>
  )
}
