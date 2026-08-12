'use client';

import React, { useState, useEffect } from 'react';
import AdminPanelLayout from './AdminPanelLayout';
import { AdminHeaderBar, AdminTableHeader } from './AdminHeader';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumBadge from '@/components/ui/PremiumBadge';

interface HospitalItem {
  id: string;
  name: string;
  tel: string;
  address: string;
  treated: boolean;
  notes: string;
}

export default function HospitalManager({ showMsg }: { showMsg: (type: 'success' | 'error', text: string) => void }) {
  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHospital, setEditingHospital] = useState<HospitalItem | null>(null);
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [hospitalForm, setHospitalForm] = useState<Omit<HospitalItem, 'id'>>({
    name: '',
    tel: '',
    address: '',
    treated: false,
    notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/medical');
      if (res.ok) {
        const data = await res.json();
        setHospitals(data || []);
      }
    } catch {
      showMsg('error', '병원 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenEdit = (h: HospitalItem) => {
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

  const handleOpenAdd = () => {
    setEditingHospital(null);
    setIsAddingHospital(true);
    setHospitalForm({ name: '', tel: '', address: '', treated: false, notes: '' });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...hospitals];

    if (isAddingHospital) {
      updated.push({ id: 'h_' + crypto.randomUUID(), ...hospitalForm });
    } else if (editingHospital) {
      updated = updated.map(item => item.id === editingHospital.id ? { id: editingHospital.id, ...hospitalForm } : item);
    }

    await saveHospitalsData(updated);
    setEditingHospital(null);
    setIsAddingHospital(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 병원 정보를 삭제하시겠습니까?')) return;
    const updated = hospitals.filter(item => item.id !== id);
    await saveHospitalsData(updated);
  };

  const handleToggleTreated = async (h: HospitalItem) => {
    const updated = hospitals.map(item => item.id === h.id ? { ...item, treated: !item.treated } : item);
    await saveHospitalsData(updated);
  };

  if (loading) {
    return (
      <AdminPanelLayout innerClassName="flex items-center justify-center w-full h-full bg-white dark:bg-[#111111]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-none-full animate-spin"></div>
      </AdminPanelLayout>
    );
  }

  const isFormOpen = editingHospital || isAddingHospital;
  const tableColumns = [
    { label: '병원명', align: 'left' as const },
    { label: '주소', align: 'left' as const },
    { label: '상태', width: 'w-24' },
    { label: '관리', width: 'w-32' }
  ];

  return (
    <AdminPanelLayout innerClassName="flex flex-col w-full h-full bg-white dark:bg-[#111111]">
      <AdminHeaderBar 
        title={
          <div className="flex items-center gap-2">
            <span>🏥 야간·휴일 진료 병원</span>
            <span className="text-[10px] md:text-xs text-gray-400 font-medium hidden sm:inline ml-2 font-normal tracking-normal">
              {isFormOpen ? '병원 상세 정보를 관리합니다.' : '우리 동네 야간/휴일 진료 병원을 관리합니다.'}
            </span>
          </div>
        }
        action={
          !isFormOpen && (
            <button
              onClick={handleOpenAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-none-none cursor-pointer transition-colors shadow-2xl flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              병원 추가
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
                    {hospitals.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-500 font-medium">
                          등록된 병원이 존재하지 않습니다.
                        </td>
                      </tr>
                    ) : (
                      hospitals.map(h => (
                        <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 dark:text-white text-sm">{h.name}</span>
                              <span className="text-gray-500 dark:text-gray-400 font-mono mt-0.5 text-xs">{h.tel}</span>
                              {h.notes && <span className="text-[10px] text-gray-400 mt-1 line-clamp-1">{h.notes}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{h.address}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleTreated(h)}
                              className={`px-2.5 py-1 rounded-none-none text-[10px] font-bold transition-colors ${h.treated ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
                            >
                              {h.treated ? '진료중' : '진료종료'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleOpenEdit(h)} className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-none-none transition-colors" title="수정">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-none-none transition-colors" title="삭제">
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
              {hospitals.length === 0 ? (
                <div className="text-center py-10 text-sm font-medium text-gray-500 bg-white dark:bg-zinc-900 rounded-none-none border border-gray-200 dark:border-zinc-800">
                  등록된 병원이 존재하지 않습니다.
                </div>
              ) : (
                hospitals.map(h => (
                  <PremiumCard key={h.id} borderColor={h.treated ? 'green' : 'default'} className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1.5">
                        <PremiumBadge color={h.treated ? 'green' : 'gray'} className="w-fit" onClick={() => handleToggleTreated(h)}>{h.treated ? '진료중' : '진료종료'}</PremiumBadge>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{h.name}</h4>
                        <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">{h.tel}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleOpenEdit(h)} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-none-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(h.id)} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-none-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-none-none p-3 text-xs text-gray-600 dark:text-gray-400 space-y-1.5 border border-gray-100 dark:border-zinc-800">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-gray-700 dark:text-gray-300 shrink-0">주소:</span>
                        <span>{h.address}</span>
                      </div>
                      {h.notes && (
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-gray-700 dark:text-gray-300 shrink-0">메모:</span>
                          <span>{h.notes}</span>
                        </div>
                      )}
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
                {isAddingHospital ? '🆕 병원 정보 추가' : '✏️ 병원 정보 수정'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">병원명</label>
                    <input type="text" value={hospitalForm.name} onChange={e => setHospitalForm({ ...hospitalForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">전화번호</label>
                    <input type="text" value={hospitalForm.tel} onChange={e => setHospitalForm({ ...hospitalForm, tel: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">주소</label>
                  <input type="text" value={hospitalForm.address} onChange={e => setHospitalForm({ ...hospitalForm, address: e.target.value })} className="w-full px-4 py-2.5 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">참고사항 (진료시간 등)</label>
                  <textarea value={hospitalForm.notes} onChange={e => setHospitalForm({ ...hospitalForm, notes: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-none-none border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 p-4 rounded-none-none border border-gray-100 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    id="treatedCheck"
                    checked={hospitalForm.treated}
                    onChange={e => setHospitalForm({ ...hospitalForm, treated: e.target.checked })}
                    className="w-5 h-5 rounded-none border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="treatedCheck" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                    현재 진료중 (목록에 강조 표시)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <button type="button" onClick={() => { setEditingHospital(null); setIsAddingHospital(false); }} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-none-none transition-colors">
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
