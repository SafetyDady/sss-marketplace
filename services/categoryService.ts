// /services/categoryService.ts

import { db } from '../firebase/firebase'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
} from 'firebase/firestore'

// 1. โครงสร้างหมวดหมู่
export interface CategoryDoc {
  id: string
  name: string
  parentId?: string | null
}

// 2. ดึงข้อมูลแบบ flat (ใช้กับ CategoryAdmin)
export const getCategories = async (): Promise<CategoryDoc[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'))
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      name: docItem.data().name,
      parentId: docItem.data().parentId || null,
    }))
  } catch (error) {
    console.error('getCategories error:', error)
    return []
  }
}

// 3. ดึงข้อมูลแบบ tree (main > sub > sub2)
export const getCategoryTree = async (): Promise<Record<string, any>> => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'))
    const flat: CategoryDoc[] = snapshot.docs.map(docItem => ({
      id: docItem.id,
      name: docItem.data().name,
      parentId: docItem.data().parentId || null,
    }))

    const mainCategories = flat.filter(cat => !cat.parentId)
    const tree: Record<string, any> = {}

    for (const main of mainCategories) {
      const subCats = flat.filter(sub => sub.parentId === main.id)
      const subTree: Record<string, any> = {}

      for (const sub of subCats) {
        const sub2List = flat
          .filter(sub2 => sub2.parentId === sub.id)
          .map(sub2 => ({
            id: sub2.id,
            name: sub2.name,
          }))

        subTree[sub.id] = {
          id: sub.id,
          name: sub.name,
          sub2: sub2List,
        }
      }

      tree[main.id] = {
        id: main.id,
        name: main.name,
        sub: subTree,
      }
    }

    return tree
  } catch (error) {
    console.error('getCategoryTree error:', error)
    return {}
  }
}

// 4. เพิ่มหมวดหมู่
export const addCategory = async (data: { name: string; parentId?: string | null }) => {
  try {
    const ref = collection(db, 'categories')
    const docRef = await addDoc(ref, {
      name: data.name,
      parentId: data.parentId || null,
    })
    return {
      id: docRef.id,
      name: data.name,
      parentId: data.parentId || null,
    }
  } catch (error) {
    console.error('addCategory error:', error)
    throw error
  }
}

// 5. แก้ไขหมวดหมู่
export const updateCategory = async (
  id: string,
  data: { name?: string; parentId?: string | null }
) => {
  try {
    const ref = doc(db, 'categories', id)
    await updateDoc(ref, data as DocumentData)
  } catch (error) {
    console.error('updateCategory error:', error)
    throw error
  }
}

// 6. ลบหมวดหมู่
export const deleteCategory = async (id: string) => {
  try {
    const ref = doc(db, 'categories', id)
    await deleteDoc(ref)
  } catch (error) {
    console.error('deleteCategory error:', error)
    throw error
  }
}
