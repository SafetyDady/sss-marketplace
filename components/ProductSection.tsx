'use client'

import { useEffect, useState } from 'react'
import ProductGrid from './product/ProductGrid'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/firebase'

/*
File: /components/ProductSection.tsx
Version 2.1 | 2025-05-31
เหตุผล: ปรับให้ดึงหมวดหมู่ (main category) จาก Firestore DB จริง, ปุ่มเลือกหมวดอัตโนมัติ, พร้อม ProductGrid ใช้ category ที่เลือก
*/

export default function ProductSection() {
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // โหลดหมวดหมู่จาก Firestore (main category)
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      const q = query(collection(db, 'categories'), where('parentId', '==', null))
      const snap = await getDocs(q)
      const cats = snap.docs.map((doc) => ({
        id: doc.id,
        label: doc.data().name as string,
      }))
      setCategories(cats)
      setSelectedCategory(cats[0]?.id || '') // เลือกตัวแรกโดยอัตโนมัติ
      setLoading(false)
    }
    fetchCategories()
  }, [])

  // กำหนด loading UI หรือกรณีไม่พบหมวด
  if (loading) {
    return (
      <section className="w-full bg-gray-50 py-6">
        <div className="max-w-full lg:max-w-[70vw] px-4 lg:px-0 mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            สินค้าเพิ่งเติม
          </h2>
          <div className="text-gray-400 py-12 text-center">กำลังโหลดหมวดหมู่...</div>
        </div>
      </section>
    )
  }

  if (!categories.length) {
    return (
      <section className="w-full bg-gray-50 py-6">
        <div className="max-w-full lg:max-w-[70vw] px-4 lg:px-0 mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            สินค้าเพิ่งเติม
          </h2>
          <div className="text-red-400 py-12 text-center">ไม่พบหมวดหมู่สินค้า</div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-gray-50 py-6">
      <div className="max-w-full lg:max-w-[70vw] px-4 lg:px-0 mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          สินค้าเพิ่งเติม
        </h2>

        {/* 🔘 ปุ่มเลือกหมวดสินค้า */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 🛒 แสดงสินค้าเฉพาะกลุ่มที่เลือก */}
        <ProductGrid category={selectedCategory} />
      </div>
    </section>
  )
}
