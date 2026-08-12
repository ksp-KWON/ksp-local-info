'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // API 라우트에 접근하여 현재 쿠키가 유효한지 확인합니다.
        // /api/admin/medical 등은 모두 인증을 요구하므로 가장 가벼운 체크용 API를 호출하거나,
        // 단순하게 medical 리스트를 호출해보고 401이면 로그인으로 보냅니다.
        const res = await fetch('/api/admin/medical');
        if (res.status === 401 || res.status === 403) {
          setIsAuthenticated(false);
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (e) {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-none-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // router.push 로 이동 중
  }

  return <AdminDashboardClient />;
}
