'use client'
import { useState } from 'react'

/*
File: /components/product/ProductDetailSection.tsx
Version 1.3 | 2025-05-31
เหตุผล: ปรับให้ gallery แสดงรูปทั้งหมด (main + extraImageUrls) สูงสุด 5 รูป
*/

export default function ProductDetailSection({ product }: { product: any }) {
  // รวม mainImageUrl + extraImageUrls เป็น array เดียว
  const galleryImages: string[] = [
    ...(product?.mainImageUrl ? [product.mainImageUrl] : []),
    ...(Array.isArray(product?.extraImageUrls) ? product.extraImageUrls.filter(Boolean) : []),
  ].slice(0, 5) // จำกัดแค่ 5 รูป

  const [mainImage, setMainImage] = useState(galleryImages[0] || '')

  return (
    <div className="w-full bg-[#f5f5f7] py-10 min-h-screen">
      <div className="max-w-[1280px] mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-row gap-12">
          {/* Gallery Section - Left */}
          <div className="w-[420px] flex-shrink-0 flex flex-col items-center">
            {/* Main Image */}
            <div className="w-[400px] h-[400px] bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="product main"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-300 text-lg">ยังไม่มีรูป</span>
              )}
            </div>
            {/* Thumbnail Gallery */}
            <div className="flex gap-2 mt-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`w-[70px] h-[70px] rounded border ${
                    mainImage === img ? 'border-pink-500' : 'border-gray-200'
                  } overflow-hidden flex items-center justify-center`}
                  onClick={() => setMainImage(img)}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Detail Section - Right */}
          <div className="flex-1 flex flex-col justify-between min-h-[400px]">
            {/* ...ส่วนอื่นเหมือนเดิม... */}
            <div>
              <h1 className="text-2xl font-bold mb-2 text-gray-800">
                {product?.name || 'ชื่อสินค้า'}
              </h1>
              <div className="text-pink-600 text-3xl font-extrabold mb-3">
                ฿{product?.price ? Number(product.price).toLocaleString() : '0'}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                หน่วย: {product?.unit || '-'} | คงเหลือ: {product?.stock || 0}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                ขนาด: {product?.size || '-'}
              </div>
              {product?.weight && (
                <div className="text-sm text-gray-600 mb-2">
                  น้ำหนัก: {product.weight} Kg
                </div>
              )}
              {product?.deliveryMethod && (
                <div className="text-sm text-gray-600 mb-2">
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
            <div className="flex gap-4 mt-8 justify-center">
              <button className="bg-pink-600 text-white px-10 py-3 rounded-lg text-lg font-bold hover:bg-pink-700 transition">
                ซื้อเลย
              </button>
              <button className="border border-pink-600 text-pink-600 px-10 py-3 rounded-lg text-lg font-bold bg-white hover:bg-pink-50 transition">
                ใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <h2 className="font-bold text-lg mb-2">รายละเอียดสินค้า</h2>
          <div className="text-gray-700 whitespace-pre-line">
            {product?.description || 'ไม่มีรายละเอียด'}
          </div>
        </div>
      </div>
    </div>
  )
}
