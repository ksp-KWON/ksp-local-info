'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import HospitalManager from '@/components/admin/HospitalManager';
import EventManager from '@/components/admin/EventManager';
import PostManager from '@/components/admin/PostManager';
import SettingsPanel from '@/components/admin/SettingsPanel';
import MobileAdminNav, { UijeongbuAdminTab } from '@/components/admin/MobileAdminNav';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UijeongbuAdminTab>('hospitals');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch {
      showMsg('error', '로그아웃 실패');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 font-sans h-full overflow-hidden relative">
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-none-none shadow-2xl transition-all transform flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {message.type === 'success' ? '✅' : '❌'}
          <span className="font-bold text-sm tracking-tight">{message.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="h-14 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-2xl z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-none-none flex items-center justify-center text-white font-bold text-lg shadow-2xl">
            🏥
          </div>
          <span className="font-extrabold text-slate-800 dark:text-slate-100 tracking-tight text-lg hidden sm:block">
            통합 관리자 패널
          </span>
          <span className="font-extrabold text-slate-800 dark:text-slate-100 tracking-tight text-base sm:hidden">
            관리자 센터
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            내 사이트 ↗
          </a>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors hidden sm:block"
          >
            로그아웃
          </button>
        </div>
      </nav>

      {/* Main Content Area (Sidebar + Panel) */}
      <div className="flex-1 flex flex-row overflow-hidden relative pb-[64px] md:pb-0">
        
        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:flex w-[240px] shrink-0 flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4 overflow-y-auto custom-scrollbar z-20">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`w-full text-left px-4 py-3 rounded-none-none text-sm font-bold transition-all ${activeTab === 'hospitals' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-2xl' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
            >
              🏥 야간·휴일 진료 병원
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full text-left px-4 py-3 rounded-none-none text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-2xl' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
            >
              🎪 행사·축제 정보
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`w-full text-left px-4 py-3 rounded-none-none text-sm font-bold transition-all ${activeTab === 'benefits' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-2xl' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
            >
              🎁 지원금·혜택 정보
            </button>
            <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full text-left px-4 py-3 rounded-none-none text-sm font-bold transition-all ${activeTab === 'posts' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 shadow-2xl' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
            >
              📝 블로그 포스트 관리
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-none-none text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:text-slate-200 shadow-2xl' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
            >
              ⚙️ 환경 설정
            </button>
          </div>
        </div>

        {/* Panel View */}
        <div className="flex-1 flex flex-col w-full min-w-0 min-h-0 bg-gray-50 dark:bg-zinc-950 overflow-hidden">
          {activeTab === 'hospitals' && <HospitalManager showMsg={showMsg} />}
          {activeTab === 'events' && <EventManager showMsg={showMsg} activeTab="events" />}
          {activeTab === 'benefits' && <EventManager showMsg={showMsg} activeTab="benefits" />}
          {activeTab === 'posts' && <PostManager showMsg={showMsg} />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>

      </div>

      <MobileAdminNav activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
    </div>
  );
}
