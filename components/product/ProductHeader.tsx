'use client';

import { useState } from 'react';

const popularSearches = [
  'เหล็กกล่อง',
  'สีทาเหล็ก',
  'โซลาร์เซลล์',
  'ประตูม้วน',
  'เครื่องมือช่าง',
];

export default function ProductHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔷 HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gray-100 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          {/* โลโก้ */}
          <div className="text-xl font-bold text-indigo-700 whitespace-nowrap">
            🛒 MTP Supply
          </div>

          {/* Search (Desktop) */}
          <div className="flex-1 mx-4 hidden md:flex">
            <input
              type="text"
              placeholder="ค้นหาสินค้า เช่น ลวดตาข่าย..."
              className="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-orange-500 text-white px-4 rounded-r-md">
              🔍
            </button>
          </div>

          {/* ไอคอน */}
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <span className="hidden md:inline">🎁 โปรโมชัน</span>
            <span className="hidden md:inline">🛍 คูปอง</span>
            <button className="text-lg">🛒</button>
          </div>
        </div>

        {/* Search (Mobile) */}
        <div className="md:hidden px-4 pb-2">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 🔶 CATEGORY BAR */}
        <div className="w-full bg-white border-t border-gray-200 shadow-sm z-40 relative">
          <div className="w-full bg-white border-b border-gray-200 shadow-sm z-40 relative">
            {/* ปุ่มหมวดหมู่ */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="font-semibold text-gray-700 hover:text-indigo-600 text-sm"
              >
                หมวดหมู่ ▼
              </button>

              {open && (
                <div className="absolute left-0 top-full mt-2 bg-white shadow border border-gray-200 rounded-md z-50 p-2 w-40">
                  <ul className="space-y-1 text-xs leading-tight text-gray-700">
                    <li className="cursor-pointer hover:text-indigo-600">อุปกรณ์ไฟฟ้า</li>
                    <li className="cursor-pointer hover:text-indigo-600">ปั๊มน้ำ / ท่อ</li>
                    <li className="cursor-pointer hover:text-indigo-600">วัสดุก่อสร้าง</li>
                    <li className="cursor-pointer hover:text-indigo-600">สี / เคมีภัณฑ์</li>
                  </ul>
                </div>
              )}
            </div>

            {/* คำค้นยอดนิยม */}
            <div className="w-full md:flex-1 flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide text-gray-600 text-[13px]">
              {popularSearches.map((item, i) => (
                <span
                  key={i}
                  className="hover:text-indigo-600 cursor-pointer shrink-0 min-w-max"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
