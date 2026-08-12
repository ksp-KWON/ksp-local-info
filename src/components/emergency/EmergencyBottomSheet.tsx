import React from 'react';
import { EmergencyItem, TabType } from '@/lib/api/emergency';
import { MapPin, Phone, X, Clock, Moon } from 'lucide-react';

interface BottomSheetProps {
  item: EmergencyItem | null;
  activeTab: TabType;
  onClose: () => void;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'good': return 'green';
    case 'normal': return 'yellow';
    case 'busy': return 'pink';
    default: return 'gray';
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
    <div className="absolute z-10 bottom-6 left-4 right-4 max-w-md mx-auto animate-slide-up">
      <div className="bg-white/95 dark:bg-[#1a1c20]/95 backdrop-blur-md rounded-none-none overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className={`${activeTab === 'er' ? 'bg-red-500/10' : 'bg-emerald-500/10'} px-6 py-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-800/50`}>
          <h3 className="font-bold text-gray-900 dark:text-white text-[17px] tracking-tight truncate pr-4">
            {item.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-none-full p-2 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        
      <div className="p-6 space-y-5">
          {activeTab === 'er' && (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">실시간 응급실 병상</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{item.availableBeds}</span>
                  <span className="text-sm text-gray-400 font-medium">/ {item.totalBeds}석</span>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-none-full text-sm font-bold shadow-2xl ${item.status === 'good' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : item.status === 'busy' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                {getStatusText(item.status)}
              </span>
            </div>
          )}

          {activeTab === 'pharmacy' && (
            <div className="flex items-center gap-2">
              {item.isNightOpen && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-none-full text-[13px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Moon className="w-3.5 h-3.5" /> 심야 운영
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-none-full text-[13px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Clock className="w-3.5 h-3.5" /> {item.hours}
              </span>
            </div>
          )}

          <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300 leading-snug break-keep">
                {item.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 shrink-0" />
              <a href={`tel:${item.tel}`} className="text-[14px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                {item.tel}
              </a>
            </div>
          </div>
          
          <div className="mt-2">
            <a 
              href={`https://map.kakao.com/link/to/${item.name},${item.lat},${item.lng}`}
              className={`flex items-center justify-center w-full py-3.5 rounded-none-none font-bold text-white transition-all shadow-2xl hover:shadow-2xl hover:-translate-y-0.5 ${activeTab === 'er' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              길찾기 바로가기
            </a>
          </div>
          
          {activeTab === 'er' && (
            <p className="text-[11px] font-medium text-gray-400 text-right mt-3">
              업데이트: {item.updatedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
