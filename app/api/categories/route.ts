import { NextResponse } from "next/server";
// เปลี่ยน import alias "@/utils/firebaseAdmin" เป็น "../../utils/firebaseAdmin"
import { db } from "../../utils/firebaseAdmin"; // ใช้ Firestore Admin SDK

export async function GET() {
  const snapshot = await db.collection("categories").get();
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return NextResponse.json(data);
}
