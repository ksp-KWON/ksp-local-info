import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authenticated = await isAuthenticated();

  // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
  if (!authenticated) {
    redirect('/admin/login');
  }

  return <AdminDashboardClient />;
}
