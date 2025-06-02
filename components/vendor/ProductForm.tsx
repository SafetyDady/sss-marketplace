'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/firebase'

/*
File: /components/vendor/ProductForm.tsx
Version 3.5 | 2025-06-02
มาตรฐาน Validate รูปภาพ: .jpg .jpeg .png .webp, ≤ 2MB, UX แนะนำ, errorFields ทุกช่อง
*/

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export default function ProductForm({
  onProductDataChange,
  errorFields = {},
  onCategoryStateChange,
}: {
  onProductDataChange: (data: any) => void,
  errorFields?: { [key: string]: string }
  onCategoryStateChange?: (sub: any[], sub2: any[]) => void
}) {
  // ฟิลด์หลัก
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [unit, setUnit] = useState('')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [weight, setWeight] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('')
  const [description, setDescription] = useState('')
  // รูป
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [extraImageUrls, setExtraImageUrls] = useState<File[]>([])
  const [imageError, setImageError] = useState('')
  // หมวดหมู่
  const [mainCategories, setMainCategories] = useState<any[]>([])
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [sub2Categories, setSub2Categories] = useState<any[]>([])
  const [mainCatId, setMainCatId] = useState('')
  const [subCatId, setSubCatId] = useState('')
  const [sub2CatId, setSub2CatId] = useState('')

  // โหลดหมวดหมู่ 3 ชั้น
  useEffect(() => {
    const fetchMain = async () => {
      const q = query(collection(db, 'categories'), where('parentId', '==', null))
      const snap = await getDocs(q)
      setMainCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
    fetchMain()
  }, [])
  useEffect(() => {
    if (!mainCatId) { setSubCategories([]); setSubCatId(''); return }
    const fetchSub = async () => {
      const q = query(collection(db, 'categories'), where('parentId', '==', mainCatId))
      const snap = await getDocs(q)
      setSubCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setSubCatId('')
      setSub2Categories([])
      setSub2CatId('')
    }
    fetchSub()
  }, [mainCatId])
  useEffect(() => {
    if (!subCatId) { setSub2Categories([]); setSub2CatId(''); return }
    const fetchSub2 = async () => {
      const q = query(collection(db, 'categories'), where('parentId', '==', subCatId))
      const snap = await getDocs(q)
      setSub2Categories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setSub2CatId('')
    }
    fetchSub2()
  }, [subCatId])

  // ส่ง state sub/sub2 ขึ้น parent (AddProductPage)
  useEffect(() => {
    onCategoryStateChange?.(subCategories, sub2Categories)
  }, [subCategories, sub2Categories])

  // ส่งข้อมูลกลับ preview
  useEffect(() => {
    const main = mainCategories.find(c => c.id === mainCatId) || null
    const sub = subCategories.find(c => c.id === subCatId) || null
    const sub2 = sub2Categories.find(c => c.id === sub2CatId) || null
    onProductDataChange({
      name, sku, unit, size, price, stock, weight, deliveryMethod, description, mainImage, extraImageUrls,
      category: {
        main: main ? { id: main.id, name: main.name } : null,
        sub: sub ? { id: sub.id, name: sub.name } : null,
        sub2: sub2 ? { id: sub2.id, name: sub2.name } : null,
      }
    })
  }, [
    name, sku, unit, size, price, stock, weight, deliveryMethod, description, mainImage, extraImageUrls,
    mainCatId, subCatId, sub2CatId, mainCategories, subCategories, sub2Categories, onProductDataChange
  ])

  // --- Validate/handler file type/size ---
  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return setMainImage(null)
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError('รองรับเฉพาะ .jpg .jpeg .png .webp เท่านั้น')
      setMainImage(null)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError('ไฟล์รูปต้องไม่เกิน 2MB')
      setMainImage(null)
      return
    }
    setMainImage(file)
    setImageError('')
  }

  function handleExtraImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const selected = Array.from(files)
    if (selected.length > 4) {
      setImageError('อัปโหลดได้สูงสุด 4 รูป (ไม่รวมรูปหลัก)')
      return
    }
    for (const file of selected) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setImageError('รองรับเฉพาะ .jpg .jpeg .png .webp เท่านั้น')
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setImageError('ไฟล์รูปต้องไม่เกิน 2MB')
        return
      }
    }
    setImageError('')
    setExtraImageUrls(selected)
  }

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <form className="flex flex-col gap-3 w-full" onSubmit={e => e.preventDefault()}>
        {/* ชื่อสินค้า */}
        <div>
          <input className={`w-full border p-2 rounded ${errorFields?.name ? 'border-red-500' : ''}`}
            placeholder="ชื่อสินค้า"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errorFields?.name && <div className="text-xs text-red-600 mt-1">{errorFields.name}</div>}
        </div>
        {/* ขนาดสินค้า */}
        <div>
          <input
            className={`w-full border p-2 rounded ${errorFields?.size ? 'border-red-500' : ''}`}
            placeholder="ขนาดสินค้า (เช่น 41/40/38mm)"
            value={size}
            onChange={e => setSize(e.target.value)}
          />
          {errorFields?.size && <div className="text-xs text-red-600 mt-1">{errorFields.size}</div>}
        </div>
        {/* รหัส/หน่วย */}
        <div className="flex gap-2 w-full">
          <input className="w-full border p-2 rounded" placeholder="รหัสสินค้า (SKU)" value={sku} onChange={e => setSku(e.target.value)} />
          <input className={`w-full border p-2 rounded ${errorFields?.unit ? 'border-red-500' : ''}`}
            placeholder="หน่วยสินค้า (ชิ้น/กล่อง)" value={unit} onChange={e => setUnit(e.target.value)} />
        </div>
        {errorFields?.unit && <div className="text-xs text-red-600 mt-1">{errorFields.unit}</div>}
        {/* ราคา/คงเหลือ */}
        <div className="flex gap-2 w-full">
          <input className={`w-full border p-2 rounded ${errorFields?.price ? 'border-red-500' : ''}`}
            type="number" placeholder="ราคา" value={price} onChange={e => setPrice(e.target.value)} />
          <input className={`w-full border p-2 rounded ${errorFields?.stock ? 'border-red-500' : ''}`}
            type="number" placeholder="จำนวนคงเหลือ" value={stock} onChange={e => setStock(e.target.value)} />
        </div>
        {errorFields?.price && <div className="text-xs text-red-600 mt-1">{errorFields.price}</div>}
        {errorFields?.stock && <div className="text-xs text-red-600 mt-1">{errorFields.stock}</div>}
        {/* น้ำหนัก/ขนส่ง */}
        <div className="flex gap-2 w-full">
          <div className="w-full">
            <input
              className={`w-full border p-2 rounded ${errorFields?.weight ? 'border-red-500' : ''}`}
              type="number" step="0.01" min="0"
              placeholder="น้ำหนัก (Kg)"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
            {errorFields?.weight && <div className="text-xs text-red-600 mt-1">{errorFields.weight}</div>}
          </div>
          <div className="w-full">
            <input
              className={`w-full border p-2 rounded ${errorFields?.deliveryMethod ? 'border-red-500' : ''}`}
              placeholder="วิธีการขนส่ง (เช่น ไปรษณีย์)"
              value={deliveryMethod}
              onChange={e => setDeliveryMethod(e.target.value)}
            />
            {errorFields?.deliveryMethod && <div className="text-xs text-red-600 mt-1">{errorFields.deliveryMethod}</div>}
          </div>
        </div>
        {/* รายละเอียด */}
        <div>
          <textarea
            className={`w-full border p-2 rounded min-h-[56px] ${errorFields?.description ? 'border-red-500' : ''}`}
            placeholder="รายละเอียดสินค้า"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {errorFields?.description && <div className="text-xs text-red-600 mt-1">{errorFields.description}</div>}
        </div>
        {/* main category */}
        <div>
          <select className={`w-full border p-2 rounded ${errorFields?.category ? 'border-red-500' : ''}`}
            value={mainCatId}
            onChange={e => setMainCatId(e.target.value)}
          >
            <option value="">เลือกหมวดหมู่หลัก</option>
            {mainCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errorFields?.category && <div className="text-xs text-red-600 mt-1">{errorFields.category}</div>}
        </div>
        {/* sub-category */}
        {subCategories.length > 0 && (
          <div>
            <select className={`w-full border p-2 rounded ${errorFields?.subCategory ? 'border-red-500' : ''}`}
              value={subCatId}
              onChange={e => setSubCatId(e.target.value)}
            >
              <option value="">เลือกหมวดย่อย</option>
              {subCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errorFields?.subCategory && <div className="text-xs text-red-600 mt-1">{errorFields.subCategory}</div>}
          </div>
        )}
        {/* sub2-category */}
        {sub2Categories.length > 0 && (
          <div>
            <select className={`w-full border p-2 rounded ${errorFields?.sub2Category ? 'border-red-500' : ''}`}
              value={sub2CatId}
              onChange={e => setSub2CatId(e.target.value)}
            >
              <option value="">เลือกหมวด Sub2</option>
              {sub2Categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errorFields?.sub2Category && <div className="text-xs text-red-600 mt-1">{errorFields.sub2Category}</div>}
          </div>
        )}
        {/* รูปภาพหลัก */}
        <div>
          <label className="block font-medium mb-1">รูปภาพหลัก</label>
          <div className="text-xs text-gray-500 mb-1">
            * แนะนำใช้รูปสี่เหลี่ยมจัตุรัส (1:1) ขนาด 800x800 px หรือสูงกว่า, ไฟล์ไม่เกิน 2MB, รองรับ .jpg .jpeg .png .webp
          </div>
          <label className={`inline-block bg-gray-100 px-3 py-1 rounded cursor-pointer border mb-1 ${errorFields?.mainImage ? 'border-red-500' : 'border-pink-400'}`}>
            เลือกรูปภาพหลัก
            <input type="file" accept=".jpg,.jpeg,.png,.webp" hidden onChange={handleMainImageChange} />
          </label>
          {mainImage && <div className="text-green-700 text-xs">✔ {mainImage.name}</div>}
          {errorFields?.mainImage && <div className="text-xs text-red-600 mt-1">{errorFields.mainImage}</div>}
        </div>
        {/* รูปเพิ่มเติม ≤ 4 รูป */}
        <div>
          <label className="block font-medium mb-1">รูปภาพเพิ่มเติม (≤ 4)</label>
          <div className="text-xs text-gray-500 mb-1">
            * ขนาดและไฟล์เหมือนรูปหลัก
          </div>
          <label className={`inline-block bg-gray-100 px-3 py-1 rounded cursor-pointer border mb-1 ${errorFields?.extraImageUrls ? 'border-red-500' : 'border-pink-400'}`}>
            เลือกรูปเพิ่มเติม
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              hidden
              multiple
              onChange={handleExtraImagesChange}
            />
          </label>
          {extraImageUrls.length > 0 && (
            <ul className="text-green-700 text-xs list-disc ml-5">
              {extraImageUrls.map((file, i) => <li key={i}>{file.name}</li>)}
            </ul>
          )}
          {(errorFields?.extraImageUrls || imageError) && (
            <div className="text-xs text-red-600 mt-1">{errorFields?.extraImageUrls || imageError}</div>
          )}
        </div>
      </form>
    </div>
  )
}
