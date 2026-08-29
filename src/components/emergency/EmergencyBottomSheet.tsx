import React from 'react';
import { EmergencyItem, TabType } from '@/lib/api/emergency';
import AppIcon from '@/components/ui/AppIcon';

interface BottomSheetProps {
  item: EmergencyItem | null;
  activeTab: TabType;
  onClose: () => void;
}

const getStatusText = (status?: string) => {
  switch (status) {
    case 'good': return '여유';
    case 'normal': return '보통';
    case 'busy': return '혼잡';
    default: return '확인요망';
  }
};

export default function EmergencyBottomSheet({ item, activeTab, onClose }: BottomSheetProps) {
  if (!item) return null;

  return (
    <div className="absolute z-30 bottom-4 left-4 right-4 max-w-md mx-auto">
      <div className="bg-white dark:bg-[#181a1d] rounded-none overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)] border-2 border-black dark:border-white">
        {/* Header */}
        <div className="bg-zinc-100 dark:bg-zinc-900 px-5 py-3.5 flex justify-between items-center border-b-2 border-black dark:border-white">
          <div className="flex items-center gap-2 truncate pr-2">
            <AppIcon name={activeTab === 'er' ? 'hospital' : 'pill'} size={18} strokeWidth={2.5} />
            <h3 className="font-black text-black dark:text-white text-base tracking-tight truncate">
              {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
          >
            <AppIcon name="close" size={18} strokeWidth={2.5} className="text-black dark:text-white" />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          {activeTab === 'er' && (
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">실시간 응급실 가용 병상</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-black dark:text-white tracking-tight">{item.availableBeds}</span>
                  <span className="text-xs text-zinc-500 font-bold">/ {item.totalBeds}석</span>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-black bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white">
                {getStatusText(item.status)}
              </span>
            </div>
          )}

          {activeTab === 'pharmacy' && (
            <div className="flex items-center gap-2">
              {item.isNightOpen && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-black bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white">
                  <AppIcon name="zap" size={12} strokeWidth={2.5} /> 심야 운영
                </span>
              )}
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                <AppIcon name="calendar" size={12} strokeWidth={2} /> {item.hours}
              </span>
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
              <AppIcon name="pin" size={15} strokeWidth={2.5} className="text-black dark:text-white shrink-0 mt-0.5" />
              <p className="leading-snug break-keep">{item.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <AppIcon name="phone" size={15} strokeWidth={2.5} className="text-black dark:text-white shrink-0" />
              <a href={`tel:${item.tel}`} className="font-black text-black dark:text-white hover:underline">
                {item.tel}
              </a>
            </div>
          </div>
          
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <a 
              href={`https://map.kakao.com/link/to/${encodeURIComponent(item.name)},${item.lat},${item.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-black text-white dark:bg-white dark:text-black font-black text-xs border-2 border-black dark:border-white hover:opacity-85 transition-opacity"
            >
              <AppIcon name="navigation" size={14} strokeWidth={2.5} />
              <span>카카오맵 길찾기</span>
            </a>
          </div>
          
          {activeTab === 'er' && item.updatedAt && (
            <p className="text-[11px] font-bold text-zinc-400 text-right">
              데이터 기준: {item.updatedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
