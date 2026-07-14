'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import HospitalManager from '@/components/admin/HospitalManager';
import EventManager from '@/components/admin/EventManager';
import PostManager from '@/components/admin/PostManager';
import SettingsPanel from '@/components/admin/SettingsPanel';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'hospitals' | 'events' | 'benefits' | 'posts' | 'settings'>('hospitals');
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
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans">
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all transform flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {message.type === 'success' ? '✅' : '❌'}
          <span className="font-bold text-sm tracking-tight">{message.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                🏥
              </div>
              <span className="font-extrabold text-slate-800 dark:text-slate-100 tracking-tight text-lg">
                통합 관리자 패널
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                내 사이트 보기 ↗
              </a>
              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'hospitals' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            🏥 야간·휴일 진료 병원
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            🎪 행사·축제 정보
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'benefits' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            🎁 지원금·혜택 정보
          </button>
          <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'posts' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            📝 블로그 포스트 관리
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:text-slate-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            ⚙️ API 및 환경 설정
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === 'hospitals' && <HospitalManager showMsg={showMsg} />}
          {activeTab === 'events' && <EventManager showMsg={showMsg} activeTab="events" />}
          {activeTab === 'benefits' && <EventManager showMsg={showMsg} activeTab="benefits" />}
          {activeTab === 'posts' && <PostManager showMsg={showMsg} />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
