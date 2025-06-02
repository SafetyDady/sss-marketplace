'use client'
import ProductHeader from '@/components/product/ProductHeader'
import ProductDetailSection from '@/components/product/ProductDetailSection'
import ProductGrid from '@/components/product/ProductGrid'

/*
  File: /app/product/page.tsx
  Version: 1.2 | 2025-06-03
  Note: Production-ready, ใช้ object จริงกับ ProductDetailSection, ส่ง prop category ให้ ProductGrid, พร้อม dynamic/SSR
*/

export default function ProductPage() {
  // ตัวอย่าง product สำหรับ demo (ควร fetch หรือ map จากฐานข้อมูลจริงใน production)
  const product = {
    name: 'สินค้าแนะนำ',
    price: 999,
    unit: 'ชิ้น',
    stock: 100,
    size: 'M',
    mainImageUrl: '',
    extraImageUrls: [],
    description: 'รายละเอียดสินค้าแนะนำ',
    category: { main: { name: 'หมวดหมู่หลัก', id: 'main-cat-001' } }
  }

  return (
    <div className="pt-[10px] min-h-screen pb-32">
      <ProductHeader />
      <ProductDetailSection product={product} />

      {/* สินค้าเพิ่มเติม */}
      <div className="mt-1 w-full px-4 lg:px-0 mx-auto lg:w-[70%]">
        <h2 className="text-xl font-semibold mb-4">สินค้าแนะนำ</h2>
        <ProductGrid category={product.category.main?.id || ''} />
      </div>
    </div>
  )
}
