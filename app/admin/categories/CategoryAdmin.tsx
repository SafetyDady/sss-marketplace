'use client'
import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'

interface Category {
  id: string
  name: string
  parentId?: string | null
}

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [mainName, setMainName] = useState('')
  const [subName, setSubName] = useState('')
  const [sub2Name, setSub2Name] = useState('')
  const [selectedMainId, setSelectedMainId] = useState('')
  const [selectedSubId, setSelectedSubId] = useState('')
  const [selectedForViewMain, setSelectedForViewMain] = useState('')
  const [selectedForViewSub, setSelectedForViewSub] = useState('')

  const reloadCategories = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'categories'))
    setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[])
    setLoading(false)
  }
  useEffect(() => { reloadCategories() }, [])

  const addMain = async () => {
    if (!mainName.trim()) return
    await addDoc(collection(db, 'categories'), { name: mainName.trim(), parentId: null })
    setMainName('')
    await reloadCategories()
  }
  const addSub = async () => {
    if (!subName.trim() || !selectedMainId) return
    await addDoc(collection(db, 'categories'), { name: subName.trim(), parentId: selectedMainId })
    setSubName('')
    await reloadCategories()
  }
  const addSub2 = async () => {
    if (!sub2Name.trim() || !selectedSubId) return
    await addDoc(collection(db, 'categories'), { name: sub2Name.trim(), parentId: selectedSubId })
    setSub2Name('')
    await reloadCategories()
  }
  const deleteCategory = async (id: string) => {
    if (!confirm('ยืนยันการลบหมวดหมู่?')) return
    await deleteDoc(doc(db, 'categories', id))
    await reloadCategories()
  }

  const mains = categories.filter(c => !c.parentId)
  const subs = categories.filter(c => c.parentId === selectedMainId)
  const sub2s = categories.filter(c => c.parentId === selectedSubId)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">จัดการหมวดหมู่สินค้า</h2>
      <div className="mb-4">
        <h3 className="font-semibold">เพิ่มหมวดหลัก</h3>
        <input value={mainName} onChange={e => setMainName(e.target.value)} className="border p-2 mr-2" placeholder="ชื่อหมวดหลัก" />
        <button onClick={addMain} className="bg-blue-500 text-white px-4 py-2 rounded">เพิ่ม</button>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">เพิ่มหมวดย่อย</h3>
        <select value={selectedMainId} onChange={e => {
          setSelectedMainId(e.target.value)
          setSelectedSubId('')
        }} className="border p-2 mr-2">
          <option value="">เลือกหมวดหลัก</option>
          {mains.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input value={subName} onChange={e => setSubName(e.target.value)} className="border p-2 mr-2" placeholder="ชื่อหมวดย่อย" />
        <button onClick={addSub} className="bg-blue-500 text-white px-4 py-2 rounded">เพิ่ม</button>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">เพิ่มหมวด Sub2</h3>
        <select value={selectedSubId} onChange={e => setSelectedSubId(e.target.value)} className="border p-2 mr-2">
          <option value="">เลือกหมวดย่อย</option>
          {categories.filter(c => c.parentId === selectedMainId).map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input value={sub2Name} onChange={e => setSub2Name(e.target.value)} className="border p-2 mr-2" placeholder="ชื่อหมวด Sub2" />
        <button onClick={addSub2} className="bg-blue-500 text-white px-4 py-2 rounded">เพิ่ม</button>
      </div>
      <hr className="my-4" />
      <h3 className="font-semibold mb-2">รายการหมวดหมู่</h3>
      {loading ? <div>Loading...</div> :
        <ul>
          {mains.map(main => (
            <li key={main.id} className="mb-2">
              <span className="font-bold">{main.name}</span>
              <button onClick={() => deleteCategory(main.id)} className="text-red-500 ml-2">ลบ</button>
              <ul className="ml-6">
                {categories.filter(s => s.parentId === main.id).map(sub => (
                  <li key={sub.id}>
                    ├ {sub.name}
                    <button onClick={() => deleteCategory(sub.id)} className="text-red-500 ml-2">ลบ</button>
                    <ul className="ml-6">
                      {categories.filter(s2 => s2.parentId === sub.id).map(sub2 => (
                        <li key={sub2.id}>
                          └ {sub2.name}
                          <button onClick={() => deleteCategory(sub2.id)} className="text-red-500 ml-2">ลบ</button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}
