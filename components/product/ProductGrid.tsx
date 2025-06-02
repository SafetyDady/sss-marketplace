'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { collection, getDocs, query, where } from 'firebase/firestore'
// เปลี่ยนจาก '@/firebase/firebase' เป็น '../../firebase/firebase'
import { db } from '../../firebase/firebase'

/*
File: /components/product/ProductGrid.tsx
Version 3.3 | 2025-05-31
เหตุผล: เพิ่ม guard ป้องกัน product เป็น null หรือ undefined, layout grid 3 ช่อง desktop, error-proof 100%
*/

export default function ProductGrid({ category }: { category: string }) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) return
    setLoading(true)
    const fetch = async () => {
      try {
        const q = query(collection(db, 'products'), where('category.main.id', '==', category))
        const snap = await getDocs(q)
        const items = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setProducts(items)
      } catch (err) {
        setProducts([])
      }
      setLoading(false)
    }
    fetch()
  }, [category])

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">กำลังโหลดสินค้า...</div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center text-gray-400 py-12">ไม่มีสินค้าในหมวดนี้</div>
    )
  }

  return (
    <div className="w-full max-w-full lg:max-w-[70vw] px-4 lg:px-0 mx-auto">
      <div className="grid justify-center grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          product && (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition cursor-pointer block"
            >
              <div className="w-full h-36 relative mb-2 sm:h-44 md:h-52">
                {product.mainImageUrl ? (
                  <Image
                    src={product.mainImageUrl}
                    alt={product.name || 'สินค้า'}
                    fill
                    sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                    className="object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-gray-300">
                    ไม่มีรูป
                  </div>
                )}
              </div>
              <div className="text-xs sm:text-sm font-medium line-clamp-2 leading-tight">
                {product.name || 'ชื่อสินค้า'}
              </div>
              <div className="text-pink-500 text-sm sm:text-base font-semibold mt-1">
                {product.price ? `฿${Number(product.price).toLocaleString()}` : '-'}
              </div>
            </a>
          )
        ))}
      </div>
    </div>
  )
}
