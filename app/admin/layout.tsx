// app/admin/layout.tsx

import AdminHeader from "@/components/admin/layout/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="p-4">{children}</main>
    </div>
  );
}

