'use client';

import React, { useState, useEffect } from 'react';

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (loading) {
    return <div className="p-8 text-center text-slate-500">데이터를 불러오는 중...</div>;
  }

  const items = activeTab === 'events' ? events : benefits;

  return (
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
                {items.map(item => (
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
                {items.length === 0 && (
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
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">연계 블로그 포스트 (slug)</label>
                <input
                  type="text"
                  value={itemForm.slug}
                  onChange={e => setItemForm({ ...itemForm, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                  placeholder="연결할 경우 입력"
                />
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

            <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingItem(false);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
