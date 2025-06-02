'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import ProductGrid from '@/components/product/ProductGrid'

/*
  File: /app/product/[id]/page.tsx
  Version: 2.4 | 2025-06-02
  Note: Null safety (params?.id), รองรับ TypeScript strict, ปรับ padding-top ทั้ง container, gallery, layout production จริง
*/

export default function ProductDetailPage() {
  const params = useParams()

  const productId = typeof params?.id === 'string'
    ? params?.id
    : Array.isArray(params?.id)
      ? params?.id[0]
      : undefined

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId) return
    const fetch = async () => {
      setLoading(true)
      try {
        const ref = doc(db, 'products', productId)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() })
        } else {
          setProduct(null)
        }
      } catch (err) {
        setProduct(null)
      }
      setLoading(false)
    }
    fetch()
  }, [productId])

  if (loading) {
    return <div className="text-center py-16 text-gray-400">กำลังโหลดข้อมูลสินค้า...</div>
  }

  if (!product) {
    return <div className="text-center py-16 text-red-400">ไม่พบข้อมูลสินค้า</div>
  }

  // Gallery images
  const galleryImages: string[] = [
    ...(product?.mainImageUrl ? [product.mainImageUrl] : []),
    ...(Array.isArray(product?.extraImageUrls) ? product.extraImageUrls.filter(Boolean) : []),
  ].slice(0, 5)

  return (
    <div className="pt-[150px] lg:pt-[110px] bg-[#f5f5f7] min-h-screen">
      <div className="w-full max-w-[1280px] mx-auto bg-white rounded-lg shadow-sm p-4 md:p-8 mb-0">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Gallery */}
          <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col items-center">
            <div className="w-full h-[60vw] max-w-[400px] max-h-[400px] bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden">
              {galleryImages[0] ? (
                <img
                  src={galleryImages[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-300 text-lg">ยังไม่มีรูป</span>
              )}
            </div>
            {/* Thumbnail: กลางจอ */}
            <div className="flex gap-2 mt-4 justify-center w-full">
              {galleryImages.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className="w-16 h-16 object-cover border rounded"
                />
              ))}
            </div>
          </div>
          {/* Detail & Action + Responsive order */}
          <div className="flex-1 flex flex-col min-h-[320px]">
            {/* Info Block */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
                {product?.name || 'ชื่อสินค้า'}
              </h1>
              <div className="text-pink-600 text-2xl sm:text-3xl font-extrabold mb-3">
                ฿{product?.price ? Number(product.price).toLocaleString() : '0'}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                หน่วย: {product?.unit || '-'} | คงเหลือ: {product?.stock || 0}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                ขนาด: {product?.size || '-'}
              </div>
              {product?.weight && (
                <div className="text-sm text-gray-600 mb-1">
                  น้ำหนัก: {product.weight} Kg
                </div>
              )}
              {product?.deliveryMethod && (
                <div className="text-sm text-gray-600 mb-1">
                  วิธีขนส่ง: {product.deliveryMethod}
                </div>
              )}
              {product?.category && (
                <div className="text-xs text-gray-400 mb-2">
                  {product.category.main?.name}
                  {product.category.sub?.name && ` > ${product.category.sub.name}`}
                  {product.category.sub2?.name && ` > ${product.category.sub2.name}`}
                </div>
              )}
            </div>
            {/* รายละเอียดสินค้า (order responsive) */}
            <div className="order-1 lg:order-2 mt-4 border-t pt-4 pb-2">
              <h2 className="font-bold text-base sm:text-lg mb-2">รายละเอียดสินค้า</h2>
              <div className="text-gray-700 whitespace-pre-line">
                {product?.description || 'ไม่มีรายละเอียด'}
              </div>
            </div>
            {/* ปุ่ม Action */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 order-2 lg:order-1">
              <button className="w-full bg-pink-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-pink-700 transition">
                ซื้อเลย
              </button>
              <button className="w-full border border-pink-600 text-pink-600 py-3 rounded-lg text-lg font-bold bg-white hover:bg-pink-50 transition">
                ใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Section สินค้าในหมวดเดียวกัน */}
      <div className="max-w-[1280px] mx-auto mt-[-32px] lg:mt-8 pb-10">
        <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-6">
          สินค้าในหมวดเดียวกัน
        </h2>
        <ProductGrid category={product.category?.main?.id || ''} />
      </div>
    </div>
  )
}
