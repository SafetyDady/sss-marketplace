// /services/productService.ts
import { db, storage } from '../firebase/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export const uploadImageAndGetUrl = async (file: File) => {
  const storageRef = ref(storage, `products/main-${file.name}`)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

export const uploadMultipleImages = async (files: File[]) => {
  const urls: string[] = []
  for (const file of files) {
    const storageRef = ref(storage, `products/extras/${file.name}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    urls.push(url)
  }
  return urls
}

export const saveProductToFirestore = async (product: any) => {
  // ตัด field ที่เป็น File ออกก่อน save
  const {
    mainImage,
    extraImageUrls,
    ...dataForFirestore
  } = product

  const productToSave = {
    ...dataForFirestore,
    mainImageUrl: product.mainImageUrl,
    extraImageUrls: product.extraImageUrls,
    createdAt: product.createdAt ?? new Date(),
  }

  const productRef = collection(db, 'products')
  await addDoc(productRef, productToSave)
}

/*
Version 1.0 | 2025-05-31  
- ส่ง code เต็มไฟล์สำหรับวางทับ/เริ่มต้นใหม่  
- เหตุผล: Export ฟังก์ชันถูกต้อง, ป้องกันการ push field ที่เป็น File เข้า Firestore
*/
