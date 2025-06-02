'use client';

import { useState } from 'react';
import { addCategory } from '../../services/categoryService';

export default function FirestoreAddTest() {
  const [name, setName] = useState('');

  return (
    <div>
      <h2>เพิ่มหมวดหมู่ใหม่ (ทดสอบ)</h2>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="ชื่อหมวดหมู่"
        className="border px-2 py-1 mr-2"
      />
      <button
        onClick={async () => {
          const result = await addCategory({ name, parentId: null });
          alert('เพิ่มสำเร็จ: ' + JSON.stringify(result));
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        เพิ่ม
      </button>
    </div>
  );
}
