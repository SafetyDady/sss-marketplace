// components/admin/layout/AdminHeader.tsx

import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="text-xl font-semibold flex items-center gap-2">
        <span>🔧</span>
        <span>MTP Supply Admin</span>
      </div>
      <Link href="/">
        <button className="bg-white text-gray-800 px-4 py-1 rounded hover:bg-gray-200 transition">
          🏠 กลับหน้าหลัก
        </button>
      </Link>
    </header>
  );
}

