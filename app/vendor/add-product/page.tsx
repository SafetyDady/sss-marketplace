'use client'

import { useState } from 'react'
import ProductForm from '@/components/vendor/ProductForm'
import ProductPreviewCard from '@/components/vendor/ProductPreviewCard'
import ProductGridCard from '@/components/vendor/ProductGridCard'
import {
  uploadImageAndGetUrl,
  uploadMultipleImages,
  saveProductToFirestore,
} from '@/services/productService'

/*
  File: /app/vendor/add-product/page.tsx
  Version 4.0 | 2025-06-02
  Note: save ข้อมูลเข้า Firestore/Storage จริง, ยกเลิก mock, validate ทุก field, UX production
*/

export default function AddProductPage() {
  const [productDraft, setProductDraft] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState<number>(0)
  const [errorFields, setErrorFields] = useState<{ [key: string]: string }>({})

  const [subCategories, setSubCategories] = useState<any[]>([])
  const [sub2Categories, setSub2Categories] = useState<any[]>([])

  const handleCategoryState = (sub: any[], sub2: any[]) => {
    setSubCategories(sub)
    setSub2Categories(sub2)
  }

  const handleSubmit = async () => {
    let err: { [key: string]: string } = {}

    // Validation field หลัก
    if (!productDraft?.name?.trim()) err.name = 'กรุณากรอกชื่อสินค้า'
    if (!productDraft?.size?.trim()) err.size = 'กรุณากรอกขนาดสินค้า'
    if (!productDraft?.unit?.trim()) err.unit = 'กรุณากรอกหน่วยสินค้า'
    if (!productDraft?.price || Number(productDraft.price) <= 0) err.price = 'กรุณากรอกราคา'
    if (!productDraft?.stock?.toString() || isNaN(productDraft.stock)) err.stock = 'กรุณาระบุจำนวนคงเหลือ'
    if (!productDraft?.weight?.toString() || Number(productDraft.weight) <= 0) err.weight = 'กรุณากรอกน้ำหนัก'
    if (!productDraft?.deliveryMethod?.trim()) err.deliveryMethod = 'กรุณาระบุวิธีการขนส่ง'
    if (!productDraft?.description?.trim()) err.description = 'กรุณากรอกรายละเอียดสินค้า'
    if (!productDraft?.category?.main?.id) err.category = 'กรุณาเลือกหมวดหลัก'
    if (subCategories.length > 0 && !productDraft?.category?.sub?.id) err.subCategory = 'กรุณาเลือกหมวดย่อย'
    if (sub2Categories.length > 0 && !productDraft?.category?.sub2?.id) err.sub2Category = 'กรุณาเลือกหมวดรอง'
    if (!productDraft?.mainImage) err.mainImage = 'กรุณาเลือกรูปภาพหลัก'
    // รูปเพิ่มเติม: ต้องมีอย่างน้อย 1 (และไม่เกิน 4)
    if (!productDraft?.extraImageUrls || productDraft.extraImageUrls.length < 1) {
      err.extraImageUrls = 'กรุณาเลือกรูปเพิ่มเติมอย่างน้อย 1 รูป'
    } else if (productDraft.extraImageUrls.length > 4) {
      err.extraImageUrls = 'อัปโหลดรูปเพิ่มเติมได้สูงสุด 4 รูป'
    }

    setErrorFields(err)
    if (Object.keys(err).length > 0) return

    setLoading(true)
    try {
      // 1. อัปโหลดรูปหลัก
      const mainImageUrl = await uploadImageAndGetUrl(productDraft.mainImage)
      // 2. อัปโหลดรูปเพิ่มเติม
      const extraImageUrls = await uploadMultipleImages(productDraft.extraImageUrls || [])
      // 3. รวมข้อมูล
      const product = {
        ...productDraft,
        mainImageUrl,
        extraImageUrls,
        createdAt: new Date(),
      }
      // 4. บันทึกเข้า Firestore
      await saveProductToFirestore(product)
      // 5. reset
      setProductDraft(null)
      setFormKey(prev => prev + 1)
      setErrorFields({})
      alert('✅ เพิ่มสินค้าสำเร็จ')
    } catch {
      setErrorFields({ mainImage: '❌ เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่' })
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto flex h-screen">
      {/* ฝั่งซ้าย: Form */}
      <div
        className="w-[35%] max-w-[520px] h-full px-8 pt-[40px] pb-8 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col"
        style={{ position: 'sticky', top: 0, alignSelf: 'flex-start' }}
      >
        <h1 className="text-lg font-bold mb-2">เพิ่มสินค้าใหม่</h1>
        <div className="flex-1 flex flex-col gap-4">
          <ProductForm
            key={formKey}
            onProductDataChange={setProductDraft}
            errorFields={errorFields}
            onCategoryStateChange={handleCategoryState}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-pink-600 text-white font-bold py-3 rounded-lg text-base hover:bg-pink-700 transition active:scale-95 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? '⏳ กำลังบันทึก...' : '✅ ยืนยันเพิ่มสินค้า'}
        </button>
      </div>
      {/* ฝั่งขวา: Preview + ProductGridCard */}
      <div className="w-[65%] h-full overflow-y-auto flex flex-col items-center px-8 pt-[40px] pb-10 bg-[#f7f5fb]">
        <div className="w-full flex justify-center">
          <div className="max-w-[900px] w-full">
            <ProductPreviewCard product={productDraft} />
          </div>
        </div>
        <div className="w-full flex justify-center mt-10">
          <div className="max-w-[900px] w-full">
            <h2 className="text-lg font-bold mb-4">แสดงตัวอย่างรูปแบบ Grid</h2>
            <div className="grid grid-cols-3 gap-6">
              <ProductGridCard product={productDraft} />
              <ProductGridCard product={productDraft} />
              <ProductGridCard product={productDraft} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
