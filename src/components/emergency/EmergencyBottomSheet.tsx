import React from 'react';
import { EmergencyItem, TabType } from '@/lib/api/emergency';

interface BottomSheetProps {
  item: EmergencyItem | null;
  activeTab: TabType;
  onClose: () => void;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'good': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30';
    case 'normal': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30';
    case 'busy': return 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30';
    default: return 'text-gray-500 bg-gray-50';
  }
};

const getStatusText = (status?: string) => {
  switch (status) {
    case 'good': return '여유';
    case 'normal': return '보통';
    case 'busy': return '혼잡';
    default: return '알수없음';
  }
};

export default function EmergencyBottomSheet({ item, activeTab, onClose }: BottomSheetProps) {
  if (!item) return null;

  return (
    <div className="absolute z-10 bottom-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-md">
      <div className="bg-white dark:bg-[#202124] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-slide-up">
        <div className={`${activeTab === 'er' ? 'bg-[#ff4757]' : 'bg-[#2ed573]'} px-5 py-3.5 flex justify-between items-center`}>
          <h3 className="font-extrabold text-white text-base truncate pr-4">
            {item.name}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white bg-black/10 rounded-full p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          {activeTab === 'er' && (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-semibold mb-1">실시간 응급실 병상</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{item.availableBeds}</span>
                  <span className="text-sm text-gray-500">/ {item.totalBeds}석</span>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border text-sm font-extrabold ${getStatusColor(item.status)}`}>
                {getStatusText(item.status)}
              </div>
            </div>
          )}

          {activeTab === 'pharmacy' && (
            <div className="flex items-center gap-2">
              {item.isNightOpen && (
                <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-2.5 py-1 rounded-md text-[11px] font-bold">
                  🌙 심야 운영
                </span>
              )}
              <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 rounded-md text-[11px] font-bold">
                🕒 {item.hours}
              </span>
            </div>
          )}

          <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="text-gray-400 shrink-0">📍</span>
              <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300 leading-snug break-keep">
                {item.address}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-gray-400 shrink-0">📞</span>
              <a href={`tel:${item.tel}`} className="text-[13px] font-bold text-[#1a73e8] dark:text-[#8ab4f8] hover:underline">
                {item.tel}
              </a>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <a 
              href={`https://map.kakao.com/link/to/${item.name},${item.lat},${item.lng}`}
              target="_blank"
              rel="noreferrer"
              className={`flex-1 flex justify-center items-center gap-1.5 py-3 rounded-xl text-sm font-bold text-white transition-transform active:scale-95 ${
                activeTab === 'er' ? 'bg-[#ff4757] shadow-lg shadow-red-500/30' : 'bg-[#2ed573] shadow-lg shadow-emerald-500/30'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              길찾기 바로가기
            </a>
          </div>
          
          {activeTab === 'er' && (
            <p className="text-[10px] text-gray-400 text-right">
              업데이트: {item.updatedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
