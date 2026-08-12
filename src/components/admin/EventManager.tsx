'use client';

import React, { useState, useEffect } from 'react';
import AdminPanelLayout from './AdminPanelLayout';
import { AdminHeaderBar, AdminTableHeader } from './AdminHeader';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumBadge from '@/components/ui/PremiumBadge';

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

export default function EventManager({ 
  showMsg, 
  activeTab 
}: { 
  showMsg: (type: 'success' | 'error', text: string) => void,
  activeTab: 'events' | 'benefits'
}) {
  const [events, setEvents] = useState<LocalItem[]>([]);
  const [benefits, setBenefits] = useState<LocalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState<LocalItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemForm, setItemForm] = useState<Omit<LocalItem, 'id'>>({
    title: '', slug: '', category: '행사', startDate: '', endDate: '', location: '', target: '', summary: '', link: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const jsonData = await res.json();
        setEvents(jsonData.events || []);
        setBenefits(jsonData.benefits || []);
      }
    } catch {
      showMsg('error', '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenEditItem = (item: LocalItem) => {
    setEditingItem(item);
    setIsAddingItem(false);
    setItemForm({ ...item, slug: item.slug || '' });
  };

  const handleOpenAddItem = (category: '행사' | '혜택') => {
    setEditingItem(null);
    setIsAddingItem(true);
    setItemForm({ title: '', slug: '', category, startDate: '', endDate: '', location: '', target: '', summary: '', link: '' });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedEvents = [...events];
    let updatedBenefits = [...benefits];

    if (isAddingItem) {
      const newItem: LocalItem = { id: (itemForm.category === '행사' ? 'e_' : 'b_') + crypto.randomUUID(), ...itemForm };
      if (itemForm.category === '행사') updatedEvents.push(newItem);
      else updatedBenefits.push(newItem);
    } else if (editingItem) {
      const updatedItem: LocalItem = { id: editingItem.id, ...itemForm };
      if (editingItem.category === '행사') updatedEvents = updatedEvents.map(item => item.id === editingItem.id ? updatedItem : item);
      else updatedBenefits = updatedBenefits.map(item => item.id === editingItem.id ? updatedItem : item);
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

  if (loading) {
    return (
      <AdminPanelLayout innerClassName="flex items-center justify-center w-full h-full bg-white dark:bg-[#111111]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-none-full animate-spin"></div>
      </AdminPanelLayout>
    );
  }

  const items = activeTab === 'events' ? events : benefits;
  const isFormOpen = editingItem || isAddingItem;

  const tableColumns = [
    { label: '제목', align: 'left' as const },
    { label: '위치/신청방법', width: 'w-48', align: 'left' as const },
    { label: '일정/마감', width: 'w-48' },
    { label: '관리', width: 'w-32' }
  ];

  return (
    <AdminPanelLayout innerClassName="flex flex-col w-full h-full bg-white dark:bg-[#111111]">
      <AdminHeaderBar 
        title={
          <div className="flex items-center gap-2">
            <span>{activeTab === 'events' ? '🎪 행사·축제 정보' : '🎁 지원금·혜택 정보'}</span>
            <span className="text-[10px] md:text-xs text-gray-400 font-medium hidden sm:inline ml-2 font-normal tracking-normal">
              {isFormOpen ? '데이터를 작성하고 수정합니다.' : '지역 주민을 위한 정보를 관리합니다.'}
            </span>
          </div>
        }
        action={
          !isFormOpen && (
            <button
              onClick={() => handleOpenAddItem(activeTab === 'events' ? '행사' : '혜택')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-none-none cursor-pointer transition-colors shadow-2xl flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              새 항목 추가
            </button>
          )
        }
      />

      <div className="flex-1 min-h-0 flex flex-col w-full">
        {!isFormOpen ? (
          <>
            {/* 데스크탑 버전 (Table) */}
            <div className="hidden md:flex flex-1 min-h-0 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                  <AdminTableHeader columns={tableColumns} />
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800/50">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-500 font-medium">
                          등록된 항목이 존재하지 않습니다.
                        </td>
                      </tr>
                    ) : (
                      items.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <PremiumBadge color={activeTab === 'events' ? 'blue' : 'purple'} className="px-2">{item.category}</PremiumBadge>
                              <span className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {item.location}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex px-2.5 py-1 rounded-none-none bg-gray-100 dark:bg-zinc-800 text-xs font-medium text-gray-700 dark:text-gray-300 font-mono">
                              {activeTab === 'events' ? `${item.startDate} ~ ${item.endDate}` : item.endDate}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleOpenEditItem(item)} className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-none-none transition-colors" title="수정">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-none-none transition-colors" title="삭제">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 모바일 뷰 */}
            <div className="md:hidden flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50/50 dark:bg-zinc-950/50 custom-scrollbar">
              {items.length === 0 ? (
                <div className="text-center py-10 text-sm font-medium text-gray-500 bg-white dark:bg-zinc-900 rounded-none-none border border-gray-200 dark:border-zinc-800">
                  등록된 항목이 존재하지 않습니다.
                </div>
              ) : (
                items.map(item => (
                  <PremiumCard key={item.id} borderColor={activeTab === 'events' ? 'blue' : 'purple'} className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1.5">
                        <PremiumBadge color={activeTab === 'events' ? 'blue' : 'purple'} className="w-fit">{item.category}</PremiumBadge>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleOpenEditItem(item)} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-none-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-none-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-none-none p-3 text-xs text-gray-600 dark:text-gray-400 space-y-1.5 border border-gray-100 dark:border-zinc-800">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-gray-700 dark:text-gray-300 shrink-0">위치:</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-gray-700 dark:text-gray-300 shrink-0">기간:</span>
                        <span className="font-mono">{activeTab === 'events' ? `${item.startDate} ~ ${item.endDate}` : item.endDate}</span>
                      </div>
                    </div>
                  </PremiumCard>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-none-none shadow-2xl p-5 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                {isAddingItem ? '🆕 신규 데이터 등록' : '✏️ 데이터 상세 수정'}
              </h3>
              
              <form onSubmit={handleSaveItem} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">제목</label>
                    <input type="text" value={itemForm.title} onChange={e => setItemForm({ ...itemForm, title: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">연계 블로그 포스트 (slug)</label>
                    <input type="text" value={itemForm.slug} onChange={e => setItemForm({ ...itemForm, slug: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="연결할 경우 입력" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">시작 일정 / 시간</label>
                    <input type="text" value={itemForm.startDate} onChange={e => setItemForm({ ...itemForm, startDate: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">종료 일정 / 마감일</label>
                    <input type="text" value={itemForm.endDate} onChange={e => setItemForm({ ...itemForm, endDate: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">위치 및 신청 수단</label>
                    <input type="text" value={itemForm.location} onChange={e => setItemForm({ ...itemForm, location: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">지원 기준 대상</label>
                    <input type="text" value={itemForm.target} onChange={e => setItemForm({ ...itemForm, target: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">간단 정보 요약</label>
                  <textarea value={itemForm.summary} onChange={e => setItemForm({ ...itemForm, summary: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" required />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">원문 링크 주소(URL)</label>
                  <input type="url" value={itemForm.link} onChange={e => setItemForm({ ...itemForm, link: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <button type="button" onClick={() => { setEditingItem(null); setIsAddingItem(false); }} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-none-none transition-colors">
                    취소
                  </button>
                  <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xl rounded-none-none transition-all active:scale-95">
                    저장하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPanelLayout>
  );
}
