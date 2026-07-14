'use client';

import React, { useState, useEffect } from 'react';

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    setHospitalForm({
      name: '',
      tel: '',
      address: '',
      treated: false,
      notes: ''
    });
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

  const handleDelete = async (id: string) => {
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

  if (loading) {
    return <div className="p-8 text-center text-slate-500">데이터를 불러오는 중...</div>;
  }

  return (
    <div>
      {!editingHospital && !isAddingHospital ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">🏥 우리동네 야간·휴일 진료 병원 리스트</h2>
            <button
              onClick={handleOpenAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer transition-colors"
            >
              + 병원 추가
            </button>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="p-4">병원명 / 전화번호</th>
                  <th className="p-4">주소</th>
                  <th className="p-4 w-[100px] text-center">진료 여부</th>
                  <th className="p-4 w-[120px] text-center">동작</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {hospitals.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                    <td className="p-4">
                      <div className="font-bold text-sm">{h.name}</div>
                      <div className="text-slate-400 font-mono mt-0.5">{h.tel}</div>
                      {h.notes && <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{h.notes}</div>}
                    </td>
                    <td className="p-4">{h.address}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleTreated(h)}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${h.treated ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                      >
                        {h.treated ? '진료중' : '진료종료'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(h)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-1 px-2 rounded cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(h.id)}
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
            {isAddingHospital ? '🆕 병원 정보 추가' : '✏️ 병원 정보 수정'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">병원명</label>
                <input
                  type="text"
                  value={hospitalForm.name}
                  onChange={e => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">전화번호</label>
                <input
                  type="text"
                  value={hospitalForm.tel}
                  onChange={e => setHospitalForm({ ...hospitalForm, tel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">주소</label>
              <input
                type="text"
                value={hospitalForm.address}
                onChange={e => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">참고사항 (진료시간 등)</label>
              <textarea
                value={hospitalForm.notes}
                onChange={e => setHospitalForm({ ...hospitalForm, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="treatedCheck"
                checked={hospitalForm.treated}
                onChange={e => setHospitalForm({ ...hospitalForm, treated: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="treatedCheck" className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
                현재 진료중 (목록에 강조 표시)
              </label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingHospital(null);
                  setIsAddingHospital(false);
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
