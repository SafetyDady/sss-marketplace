'use client'

import { useEffect, useState } from 'react'

/*
File: /components/vendor/ProductGridCard.tsx
Version 1.2 | 2025-05-31
เหตุผล: ใช้ mainImage ฝั่งซ้ายเป็นภาพหลักของ grid preview, card เสมือนจริง 100%
*/

export default function ProductGridCard({ product }: { product: any }) {
  const [mainImage, setMainImage] = useState<string>('')

  useEffect(() => {
    if (product?.mainImage instanceof File) {
      setMainImage(URL.createObjectURL(product.mainImage))
      return () => {
        URL.revokeObjectURL(mainImage)
      }
    } else if (typeof product?.mainImage === 'string') {
      setMainImage(product.mainImage)
    } else {
      setMainImage('')
    }
    // eslint-disable-next-line
  }, [product?.mainImage])

  if (!product) {
    return (
      <div className="bg-white rounded-xl shadow-md p-3 flex flex-col items-center justify-center min-h-[260px]">
        <span className="text-gray-400 text-sm">ยังไม่มีข้อมูลสินค้า</span>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition block">
      <div className="w-full h-36 relative mb-2 sm:h-44 md:h-52 flex items-center justify-center">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-contain rounded"
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
    </div>
  )
}
