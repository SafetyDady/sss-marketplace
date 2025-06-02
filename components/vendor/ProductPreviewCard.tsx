'use client'

import { useEffect, useState } from 'react'

/*
File: /components/vendor/ProductPreviewCard.tsx
Version 2.4 | 2025-06-02
เหตุผล: รูปหลัก (mainImage) = thumbnail ช่องแรกเสมอ, รวมกับ extraImageUrls อีก 4 รูป (รวม 5 ช่อง), Shopee/Lazada UX จริง
*/

export default function ProductPreviewCard({ product }: { product: any }) {
  if (!product) return <div className="text-gray-400">ยังไม่มีข้อมูลสินค้า</div>

  // State สำหรับแสดงรูปใหญ่
  const [mainImage, setMainImage] = useState<string>('')

  // เอา mainImage (File หรือ url) ขึ้นก่อนเสมอ
  useEffect(() => {
    if (product.mainImage instanceof File) {
      setMainImage(URL.createObjectURL(product.mainImage))
    } else if (typeof product.mainImage === 'string') {
      setMainImage(product.mainImage)
    }
  }, [product.mainImage])

  // รวมรูปทั้งหมด: mainImage + extraImageUrls (สูงสุด 4 รูป, รวม = 5 ช่อง)
  let thumbnails: (string | null)[] = []
  if (product.mainImage) {
    // mainImage รูปแรก
    thumbnails.push(
      product.mainImage instanceof File
        ? URL.createObjectURL(product.mainImage)
        : product.mainImage
    )
  } else {
    thumbnails.push(null)
  }
  // ตามด้วย extraImageUrls อีก 4 ช่อง
  if (Array.isArray(product.extraImageUrls)) {
    for (let i = 0; i < 4; i++) {
      const file = product.extraImageUrls[i]
      if (file instanceof File) {
        thumbnails.push(URL.createObjectURL(file))
      } else if (typeof file === 'string') {
        thumbnails.push(file)
      } else {
        thumbnails.push(null)
      }
    }
  }
  // ให้รวมได้แค่ 5 ช่องเท่านั้น
  thumbnails = thumbnails.slice(0, 5)

  return (
    <div className="w-full max-w-[700px] mx-auto bg-white border rounded shadow p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* ฝั่งรูปภาพ */}
        <div className="md:w-1/2 flex flex-col items-center">
          {/* รูปใหญ่ */}
          <div className="w-full aspect-square border rounded overflow-hidden">
            {mainImage ? (
              <img src={mainImage} alt="main" className="w-full h-full object-contain" />
            ) : (
              <div className="text-gray-300 flex items-center justify-center h-full">ยังไม่มีรูป</div>
            )}
          </div>

          {/* ✅ Thumbnail 5 ช่อง ช่องแรกเป็น mainImage */}
          <div className="grid grid-cols-5 gap-2 mt-3">
            {thumbnails.map((url, idx) => (
              <button
                key={idx}
                onClick={() => url && setMainImage(url)}
                className={`w-16 h-16 border rounded ${mainImage === url ? 'border-pink-500' : 'border-gray-300'} overflow-hidden flex items-center justify-center`}
              >
                {url ? (
                  <img src={url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-xs text-gray-300">ยังไม่มีรูป</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">{product.name || 'ชื่อสินค้า'}</h2>
            <p className="text-pink-600 text-xl font-bold mb-1">
              ฿{product.price ? Number(product.price).toLocaleString() : '0'}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              หน่วย: {product.unit || '-'} | คงเหลือ: {product.stock || 0}
            </p>
            <p className="text-sm text-gray-500 mb-1">ขนาด: {product.size || '-'}</p>
            {product.weight && (
              <p className="text-sm text-gray-500 mb-1">
                น้ำหนัก: {product.weight} Kg
              </p>
            )}
            {product.deliveryMethod && (
              <p className="text-sm text-gray-500 mb-1">
                วิธีการขนส่ง: {product.deliveryMethod}
              </p>
            )}
            {product.category && (
              <p className="text-xs text-gray-400 mb-2">
                {product.category.main?.name} &gt; {product.category.sub?.name} &gt; {product.category.sub2?.name}
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            <button className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 text-sm">ซื้อเลย</button>
            <button className="border border-pink-500 text-pink-500 px-6 py-2 rounded hover:bg-pink-50 text-sm">ใส่ตะกร้า</button>
          </div>
        </div>
      </div>
      {/* รายละเอียดสินค้า */}
      <div className="mt-6 border-t pt-4 text-sm text-gray-700">
        <h2 className="font-semibold mb-2">รายละเอียดสินค้า</h2>
        <div className="whitespace-pre-wrap">{product.description || 'ไม่มีรายละเอียด'}</div>
      </div>
    </div>
  )
}
