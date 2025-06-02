import './globals.css'
import Header from '../components/header/Header'
import { AuthProvider } from '../components/auth/AuthProvider'

/*
  File: /app/layout.tsx
  Version: 1.1 | 2025-06-01
  Note: ครอบด้วย AuthProvider เพื่อให้ Header และทุกหน้าใช้ user/auth state ได้สมบูรณ์ (Profile Dropdown + Sign Out)
*/

export const metadata = {
  title: 'MTP Supply',
  description: 'MTP Supply System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <div className="min-h-screen bg-purple-50">
            <Header />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
