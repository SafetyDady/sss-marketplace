'use client';

import { useState } from 'react';

const popularSearches = [
  'เหล็กกล่อง',
  'สีทาเหล็ก',
  'โซลาร์เซลล์',
  'ประตูม้วน',
  'เครื่องมือช่าง',
];

export default function ProductCategoryBar() {
  console.log('✅ ProductCategoryBar loaded');

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm z-40 relative">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 text-sm">
        {/* DEBUG TEST */}
        <div className="bg-red-100 text-center px-2 py-1 rounded text-xs font-semibold">
          🧪 TEST CATEGORY BAR
        </div>

        {/* 🔻 ปุ่มหมวดหมู่ */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="font-semibold text-gray-700 hover:text-indigo-600"
          >
            หมวดหมู่ ▼
          </button>

          {open && (
            <div className="absolute left-0 top-full mt-2 bg-white shadow border border-gray-200 rounded-md z-50 p-3 w-48">
              <ul className="space-y-2 text-sm">
                <li className="cursor-pointer hover:text-indigo-600">อุปกรณ์ไฟฟ้า</li>
                <li className="cursor-pointer hover:text-indigo-600">ปั๊มน้ำ / ท่อ</li>
                <li className="cursor-pointer hover:text-indigo-600">วัสดุก่อสร้าง</li>
                <li className="cursor-pointer hover:text-indigo-600">สี / เคมีภัณฑ์</li>
              </ul>
            </div>
          )}
        </div>

        {/* 🔗 คำค้นยอดนิยม */}
        <div className="flex-1 flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide text-gray-600 text-[13px]">
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
  );
}
