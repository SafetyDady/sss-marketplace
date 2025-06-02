import admin from "firebase-admin";
import serviceAccount from "@/config/serviceAccountKey.json"; // ชี้มาที่ไฟล์ที่พี่ฮอตวางไว้

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const db = admin.firestore();
