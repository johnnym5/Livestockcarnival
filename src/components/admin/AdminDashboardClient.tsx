'use client';

import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
  ssr: false,
  loading: () => <div className="grid min-h-screen place-items-center bg-[#07150D] text-sm font-semibold text-[#E4B03A]">Loading workspace…</div>,
});

export default function AdminDashboardClient({ workspace }: { workspace: 'admin' | 'editor' }) {
  return <AdminDashboard workspace={workspace} />;
}
