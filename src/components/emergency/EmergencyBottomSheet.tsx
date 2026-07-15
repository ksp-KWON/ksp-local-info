import React from 'react';
import { EmergencyItem, TabType } from '@/lib/api/emergency';
import NeoBox from '@/components/ui/NeoBox';
import NeoBadge from '@/components/ui/NeoBadge';
import NeoButton from '@/components/ui/NeoButton';

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
      <NeoBox shadowColor={activeTab === 'er' ? 'red' : 'green'} className="!p-0 bg-white dark:bg-[#202124] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`${activeTab === 'er' ? 'bg-[#ff4757]' : 'bg-[#2ed573]'} px-5 py-3.5 flex justify-between items-center border-b-2 border-black dark:border-white`}>
          <h3 className="font-dohyeon text-white text-lg tracking-wide truncate pr-4">
            {item.name}
          </h3>
          <button onClick={onClose} className="text-black bg-white/20 hover:bg-white/40 rounded-full p-1 border-2 border-black transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          {activeTab === 'er' && (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold mb-1">실시간 응급실 병상</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{item.availableBeds}</span>
                  <span className="text-sm text-gray-500 font-jua">/ {item.totalBeds}석</span>
                </div>
              </div>
              <NeoBadge color={getStatusColor(item.status)} className="!text-sm !py-1.5">
                {getStatusText(item.status)}
              </NeoBadge>
            </div>
          )}

          {activeTab === 'pharmacy' && (
            <div className="flex items-center gap-2">
              {item.isNightOpen && (
                <NeoBadge color="blue">🌙 심야 운영</NeoBadge>
              )}
              <NeoBadge color="green">🕒 {item.hours}</NeoBadge>
            </div>
          )}

          <div className="h-0.5 bg-black dark:bg-white/20 w-full opacity-10 dark:opacity-100 my-2"></div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="text-black dark:text-white shrink-0 mt-0.5">📍</span>
              <p className="text-[14px] font-jua text-gray-800 dark:text-gray-200 leading-snug break-keep">
                {item.address}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-black dark:text-white shrink-0">📞</span>
              <a href={`tel:${item.tel}`} className="text-[14px] font-jua text-blue-600 dark:text-[#8ab4f8] hover:underline underline-offset-4 decoration-2">
                {item.tel}
              </a>
            </div>
          </div>
          
          <div className="mt-4">
            <NeoButton 
              href={`https://map.kakao.com/link/to/${item.name},${item.lat},${item.lng}`}
              variant={activeTab === 'er' ? 'danger' : 'primary'}
              className="w-full flex justify-center !py-3 !text-[15px]"
            >
              길찾기 바로가기
            </NeoButton>
          </div>
          
          {activeTab === 'er' && (
            <p className="text-[11px] font-jua text-gray-400 text-right mt-2">
              업데이트: {item.updatedAt}
            </p>
          )}
        </div>
      </NeoBox>
    </div>
  );
}
