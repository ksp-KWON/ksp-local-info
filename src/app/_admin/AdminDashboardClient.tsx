'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HospitalItem {
  id: string;
  name: string;
  tel: string;
  address: string;
  treated: boolean;
  notes: string;
}

interface LocalItem {
  id: string;
  title: string;
  slug?: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

interface PostItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
  tags?: string[];
  content: string;
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'hospitals' | 'events' | 'benefits' | 'posts'>('hospitals');
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);

  // 데이터 목록 상태
  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
  const [events, setEvents] = useState<LocalItem[]>([]);
  const [benefits, setBenefits] = useState<LocalItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);

  // 편집 모드 상태
  const [editingHospital, setEditingHospital] = useState<HospitalItem | null>(null);
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [editingItem, setEditingItem] = useState<LocalItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [isAddingPost, setIsAddingPost] = useState(false);

  // 병원 폼 상태
  const [hospitalForm, setHospitalForm] = useState<Omit<HospitalItem, 'id'>>({
    name: '',
    tel: '',
    address: '',
    treated: false,
    notes: ''
  });

  // 행사/혜택 폼 상태
  const [itemForm, setItemForm] = useState<Omit<LocalItem, 'id'>>({
    title: '',
    slug: '',
    category: '행사',
    startDate: '',
    endDate: '',
    location: '',
    target: '',
    summary: '',
    link: ''
  });

  // 블로그 폼 상태
  const [postForm, setPostForm] = useState<{
    slug: string;
    originalSlug?: string;
    title: string;
    date: string;
    summary: string;
    category: string;
    tags: string;
    content: string;
  }>({
    slug: '',
    title: '',
    date: '',
    summary: '',
    category: '',
    tags: '',
    content: ''
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // 전체 데이터 조회
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. 병원 정보 조회
      const hRes = await fetch('/api/admin/medical');
      if (hRes.ok) {
        const hData = await hRes.json();
        setHospitals(hData || []);
      }

      // 2. 행사/혜택 조회
      const dataRes = await fetch('/api/admin/data');
      if (dataRes.ok) {
        const jsonData = await dataRes.json();
        setEvents(jsonData.events || []);
        setBenefits(jsonData.benefits || []);
      }
      
      // 3. 포스트 조회
      const postsRes = await fetch('/api/admin/posts');
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData || []);
      }
    } catch {
      showMsg('error', '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로그아웃
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

  // ----------------------------------------------------
  // 병원 정보 관리 로직 (CRUD & 토글 & AI 연동)
  // ----------------------------------------------------
  const handleOpenEditHospital = (h: HospitalItem) => {
    setEditingHospital(h);
    setIsAddingHospital(false);
    setHospitalForm({
      name: h.name,
      tel: h.tel,
      address: h.address,
      treated: h.treated,
      notes: h.notes
    });
  };

  const handleOpenAddHospital = () => {
    setEditingHospital(null);
    setIsAddingHospital(true);
    setHospitalForm({
      name: '',
      tel: '',
      address: '',
      treated: false,
      notes: ''
    });
  };

  const handleSaveHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...hospitals];

    if (isAddingHospital) {
      const newItem: HospitalItem = {
        id: 'h_' + crypto.randomUUID(),
        ...hospitalForm
      };
      updated.push(newItem);
    } else if (editingHospital) {
      const updatedItem: HospitalItem = {
        id: editingHospital.id,
        ...hospitalForm
      };
      updated = updated.map(item => item.id === editingHospital.id ? updatedItem : item);
    }

    await saveHospitalsData(updated);
    setEditingHospital(null);
    setIsAddingHospital(false);
  };

  const saveHospitalsData = async (list: HospitalItem[]) => {
    try {
      const res = await fetch('/api/admin/medical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
      });
      if (res.ok) {
        setHospitals(list);
        showMsg('success', '병원 정보가 반영되었습니다.');
      } else {
        showMsg('error', '저장 오류가 발생했습니다.');
      }
    } catch {
      showMsg('error', '서버 통신 실패');
    }
  };

  const handleDeleteHospital = async (id: string) => {
    if (!confirm('정말로 이 병원 정보를 삭제하시겠습니까?')) return;
    const updated = hospitals.filter(item => item.id !== id);
    await saveHospitalsData(updated);
  };

  const handleToggleTreated = async (h: HospitalItem) => {
    const updated = hospitals.map(item => 
      item.id === h.id ? { ...item, treated: !item.treated } : item
    );
    await saveHospitalsData(updated);
  };

  const handleTriggerAiGenerate = async () => {
    setAiGenerating(true);
    showMsg('success', 'Gemini AI 블로그 글 작성을 백그라운드에서 시작합니다...');
    try {
      const res = await fetch('/api/admin/generate', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg('success', `🎉 AI 글 작성 성공: ${data.output || '새 글이 발행되었습니다.'}`);
        fetchData();
      } else {
        showMsg('error', data.error || 'AI 포스팅 중 실패 또는 이미 같은 글이 존재합니다.');
      }
    } catch {
      showMsg('error', '서버 백그라운드 AI 스크립트 가동 실패');
    } finally {
      setAiGenerating(false);
    }
  };

  // ----------------------------------------------------
  // 행사 및 혜택 관리 로직
  // ----------------------------------------------------
  const handleOpenEditItem = (item: LocalItem) => {
    setEditingItem(item);
    setIsAddingItem(false);
    setItemForm({
      title: item.title,
      slug: item.slug || '',
      category: item.category,
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
      target: item.target,
      summary: item.summary,
      link: item.link
    });
  };

  const handleOpenAddItem = (category: '행사' | '혜택') => {
    setEditingItem(null);
    setIsAddingItem(true);
    setItemForm({
      title: '',
      slug: '',
      category,
      startDate: '',
      endDate: '',
      location: '',
      target: '',
      summary: '',
      link: ''
    });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedEvents = [...events];
    let updatedBenefits = [...benefits];

    if (isAddingItem) {
      const newItem: LocalItem = {
        id: (itemForm.category === '행사' ? 'e_' : 'b_') + crypto.randomUUID(),
        ...itemForm
      };
      if (itemForm.category === '행사') {
        updatedEvents.push(newItem);
      } else {
        updatedBenefits.push(newItem);
      }
    } else if (editingItem) {
      const updatedItem: LocalItem = {
        id: editingItem.id,
        ...itemForm
      };
      if (editingItem.category === '행사') {
        updatedEvents = updatedEvents.map(item => item.id === editingItem.id ? updatedItem : item);
      } else {
        updatedBenefits = updatedBenefits.map(item => item.id === editingItem.id ? updatedItem : item);
      }
    }

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: updatedEvents, benefits: updatedBenefits })
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        showMsg('success', '정보가 정상적으로 저장되었습니다.');
        setEvents(updatedEvents);
        setBenefits(updatedBenefits);
        setEditingItem(null);
        setIsAddingItem(false);
      } else {
        showMsg('error', resData.error || '저장 실패');
      }
    } catch {
      showMsg('error', '서버 통신 오류');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('정말로 이 항목을 삭제하시겠습니까?')) return;

    const updatedEvents = events.filter(item => item.id !== id);
    const updatedBenefits = benefits.filter(item => item.id !== id);

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: updatedEvents, benefits: updatedBenefits })
      });
      if (res.ok) {
        showMsg('success', '항목이 성공적으로 삭제되었습니다.');
        setEvents(updatedEvents);
        setBenefits(updatedBenefits);
      }
    } catch {
      showMsg('error', '삭제 처리 실패');
    }
  };

  // ----------------------------------------------------
  // 블로그 포스트 관리 로직
  // ----------------------------------------------------
  const handleOpenEditPost = async (post: PostItem) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts?slug=${post.slug}`);
      if (res.ok) {
        const fullPost: PostItem = await res.json();
        setEditingPost(fullPost);
        setIsAddingPost(false);
        setPostForm({
          slug: fullPost.slug,
          originalSlug: fullPost.slug,
          title: fullPost.title,
          date: fullPost.date,
          summary: fullPost.summary,
          category: fullPost.category || '기타',
          tags: (fullPost.tags || []).join(', '),
          content: fullPost.content
        });
      }
    } catch {
      showMsg('error', '상세 내용을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddPost = () => {
    setEditingPost(null);
    setIsAddingPost(true);
    setPostForm({
      slug: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      category: '일반',
      tags: '',
      content: ''
    });
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.slug.trim()) {
      showMsg('error', '슬러그(파일명)를 입력해 주세요.');
      return;
    }

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm)
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        showMsg('success', '포스트가 정상적으로 저장되었습니다.');
        setEditingPost(null);
        setIsAddingPost(false);
        fetchData();
      } else {
        showMsg('error', resData.error || '포스트 저장 실패');
      }
    } catch {
      showMsg('error', '서버 통신 오류');
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까? (마크다운 파일이 삭제됩니다)')) return;

    try {
      const res = await fetch(`/api/admin/posts?slug=${slug}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showMsg('success', '포스트가 삭제되었습니다.');
        fetchData();
      } else {
        showMsg('error', '포스트 삭제 실패');
      }
    } catch {
      showMsg('error', '삭제 처리 실패');
    }
  };

  return (
    <div className="w-full">
      {/* 관리자 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            ⚙️ 포털 관리자 시스템
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            의정부시 생활·의료 정보 및 전체 블로그 게시글을 손쉽게 실시간으로 관리합니다.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors"
        >
          안전 로그아웃
        </button>
      </div>

      {/* 알림 메시지 */}
      {message && (
        <div className={`p-4 mb-6 rounded-2xl border text-xs leading-relaxed ${
          message.type === 'success' 
            ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50' 
            : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/50'
        }`}>
          {message.type === 'success' ? 'ℹ️' : '⚠️'} {message.text}
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => { setActiveTab('hospitals'); setEditingHospital(null); setIsAddingHospital(false); }}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === 'hospitals' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          🏥 병원 목록 관리
        </button>
        <button
          onClick={() => { setActiveTab('events'); setEditingItem(null); setIsAddingItem(false); }}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === 'events' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          🎪 행사·축제 관리
        </button>
        <button
          onClick={() => { setActiveTab('benefits'); setEditingItem(null); setIsAddingItem(false); }}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === 'benefits' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          🎁 지원금·혜택 관리
        </button>
        <button
          onClick={() => { setActiveTab('posts'); setEditingPost(null); setIsAddingPost(false); }}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === 'posts' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          📝 블로그 포스팅 관리
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-xs text-slate-400">정보 동기화 중...</div>
      ) : (
        <>
          {/* ==================================================== */}
          {/* 1. 병원 관리 탭 */}
          {/* ==================================================== */}
          {activeTab === 'hospitals' && (
            <div>
              {!editingHospital && !isAddingHospital ? (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">🏥 등록된 주요 지정 병원 목록</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleTriggerAiGenerate}
                        disabled={aiGenerating}
                        className="bg-slate-850 hover:bg-slate-800 text-slate-700 dark:text-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                      >
                        🤖 {aiGenerating ? 'AI 자동생성 실행 중...' : 'Gemini AI로 글 자동생성'}
                      </button>
                      <button
                        onClick={handleOpenAddHospital}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer transition-colors"
                      >
                        + 새 병원 정보 추가
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        <tr>
                          <th className="p-4">병원명</th>
                          <th className="p-4">연락처</th>
                          <th className="p-4">주소</th>
                          <th className="p-4 w-[110px] text-center">글 작성 상태</th>
                          <th className="p-4 w-[120px] text-center">동작</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {hospitals.map(h => (
                          <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                            <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{h.name}</td>
                            <td className="p-4 font-mono">{h.tel}</td>
                            <td className="p-4">{h.address}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleToggleTreated(h)}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                                  h.treated 
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100' 
                                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
                                }`}
                              >
                                {h.treated ? '발행완료 📝' : '발행대기 ⏳'}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleOpenEditHospital(h)}
                                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-1 px-2 rounded cursor-pointer"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteHospital(h.id)}
                                  className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-1 px-2 rounded cursor-pointer"
                                >
                                  삭제
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {hospitals.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">등록된 병원 정보가 존재하지 않습니다.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* 병원 등록/수정 모달 UI */
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                    <span>🏥</span> {isAddingHospital ? '새 병원 정보 등록' : '병원 정보 상세 수정'}
                  </h3>
                  <form onSubmit={handleSaveHospital} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">병원 기관명</label>
                        <input
                          type="text"
                          value={hospitalForm.name}
                          onChange={e => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                          placeholder="예: 의정부성모병원"
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">대표 연락처 (전화번호)</label>
                        <input
                          type="text"
                          value={hospitalForm.tel}
                          onChange={e => setHospitalForm({ ...hospitalForm, tel: e.target.value })}
                          placeholder="예: 031-820-3000"
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">병원 상세 주소</label>
                        <input
                          type="text"
                          value={hospitalForm.address}
                          onChange={e => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                          placeholder="예: 경기도 의정부시 천보로 271"
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">특이사항 및 비고 (소개)</label>
                        <input
                          type="text"
                          value={hospitalForm.notes}
                          onChange={e => setHospitalForm({ ...hospitalForm, notes: e.target.value })}
                          placeholder="예: 대학병원, 권역응급의료센터 운영"
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={hospitalForm.treated}
                            onChange={e => setHospitalForm({ ...hospitalForm, treated: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                          />
                          블로그 포스팅 발행 완료 상태로 지정
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 justify-end">
                      <button
                        type="button"
                        onClick={() => { setEditingHospital(null); setIsAddingHospital(false); }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg cursor-pointer"
                      >
                        병원 정보 저장
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 2. 행사 및 혜택 관리 탭 */}
          {/* ==================================================== */}
          {(activeTab === 'events' || activeTab === 'benefits') && (
            <div>
              {!editingItem && !isAddingItem ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {activeTab === 'events' ? '🎪 행사·축제 정보 리스트' : '🎁 지원금·혜택 정보 리스트'}
                    </h2>
                    <button
                      onClick={() => handleOpenAddItem(activeTab === 'events' ? '행사' : '혜택')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer transition-colors"
                    >
                      + 새 항목 추가
                    </button>
                  </div>

                  <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        <tr>
                          <th className="p-4">제목</th>
                          <th className="p-4">위치/신청방법</th>
                          <th className="p-4">일정/마감</th>
                          <th className="p-4 w-[120px] text-center">동작</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(activeTab === 'events' ? events : benefits).map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                            <td className="p-4 font-bold">{item.title}</td>
                            <td className="p-4">{item.location}</td>
                            <td className="p-4 font-mono">
                              {activeTab === 'events' ? `${item.startDate} ~ ${item.endDate}` : item.endDate}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleOpenEditItem(item)}
                                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-1 px-2 rounded cursor-pointer"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-1 px-2 rounded cursor-pointer"
                                >
                                  삭제
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {(activeTab === 'events' ? events : benefits).length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-400">등록된 항목이 존재하지 않습니다.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    {isAddingItem ? '🆕 신규 데이터 추가' : '✏️ 데이터 정보 수정'}
                  </h3>
                  <form onSubmit={handleSaveItem} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">제목</label>
                        <input
                          type="text"
                          value={itemForm.title}
                          onChange={e => setItemForm({ ...itemForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">연계 블로그 포스트</label>
                        <select
                          value={itemForm.slug}
                          onChange={e => setItemForm({ ...itemForm, slug: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                        >
                          <option value="">블로그 포스트 미연결</option>
                          {posts.map(p => (
                            <option key={p.slug} value={p.slug}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">시작 일정 / 시간</label>
                        <input
                          type="text"
                          value={itemForm.startDate}
                          onChange={e => setItemForm({ ...itemForm, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">종료 일정 / 마감일</label>
                        <input
                          type="text"
                          value={itemForm.endDate}
                          onChange={e => setItemForm({ ...itemForm, endDate: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">위치 및 신청 수단</label>
                        <input
                          type="text"
                          value={itemForm.location}
                          onChange={e => setItemForm({ ...itemForm, location: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">지원 기준 대상</label>
                        <input
                          type="text"
                          value={itemForm.target}
                          onChange={e => setItemForm({ ...itemForm, target: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">간단 정보 요약</label>
                      <textarea
                        value={itemForm.summary}
                        onChange={e => setItemForm({ ...itemForm, summary: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">원문 링크 주소(URL)</label>
                      <input
                        type="url"
                        value={itemForm.link}
                        onChange={e => setItemForm({ ...itemForm, link: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 justify-end">
                      <button
                        type="button"
                        onClick={() => { setEditingItem(null); setIsAddingItem(false); }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg cursor-pointer"
                      >
                        정보 등록
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 3. 블로그 포스트 관리 탭 */}
          {/* ==================================================== */}
          {activeTab === 'posts' && (
            <div>
              {!editingPost && !isAddingPost ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">📝 발행 마크다운 포스트 목록</h2>
                    <button
                      onClick={handleOpenAddPost}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer transition-colors"
                    >
                      + 새 포스팅 글쓰기
                    </button>
                  </div>

                  <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        <tr>
                          <th className="p-4">글 제목 / 파일명</th>
                          <th className="p-4 w-[100px]">작성일</th>
                          <th className="p-4 w-[100px]">카테고리</th>
                          <th className="p-4 w-[120px] text-center">동작</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {posts.map(post => (
                          <tr key={post.slug} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                            <td className="p-4">
                              <div className="font-bold text-slate-800 dark:text-slate-100">{post.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{post.slug}.md</div>
                            </td>
                            <td className="p-4 font-mono">{post.date}</td>
                            <td className="p-4">
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">
                                {post.category || '기본'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleOpenEditPost(post)}
                                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-1 px-2 rounded cursor-pointer"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.slug)}
                                  className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-1 px-2 rounded cursor-pointer"
                                >
                                  삭제
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    {isAddingPost ? '📝 새 포스트 작성' : '✏️ 마크다운 본문 편집'}
                  </h3>
                  <form onSubmit={handleSavePost} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">영문 파일명(Slug)</label>
                        <input
                          type="text"
                          value={postForm.slug}
                          onChange={e => setPostForm({ ...postForm, slug: e.target.value })}
                          placeholder="uijeongbu-saint-mary"
                          disabled={!isAddingPost}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">포스트 제목</label>
                        <input
                          type="text"
                          value={postForm.title}
                          onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">작성 날짜</label>
                        <input
                          type="date"
                          value={postForm.date}
                          onChange={e => setPostForm({ ...postForm, date: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">분류 카테고리</label>
                        <input
                          type="text"
                          value={postForm.category}
                          onChange={e => setPostForm({ ...postForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">블로그 태그 (쉼표 구분)</label>
                      <input
                        type="text"
                        value={postForm.tags}
                        onChange={e => setPostForm({ ...postForm, tags: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">메타 요약 설명</label>
                      <input
                        type="text"
                        value={postForm.summary}
                        onChange={e => setPostForm({ ...postForm, summary: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">마크다운 본문</label>
                      <textarea
                        value={postForm.content}
                        onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                        rows={14}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 justify-end">
                      <button
                        type="button"
                        onClick={() => { setEditingPost(null); setIsAddingPost(false); }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg cursor-pointer"
                      >
                        블로그 포스트 발행
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
