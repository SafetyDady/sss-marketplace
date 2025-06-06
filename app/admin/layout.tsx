// app/admin/layout.tsx

// เปลี่ยน import AdminHeader จาก "@/components/admin/layout/AdminHeader" เป็น "../../components/admin/layout/AdminHeader"
import AdminHeader from "../../components/admin/layout/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="p-4">{children}</main>
    </div>
  );
}
