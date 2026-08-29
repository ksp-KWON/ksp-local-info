'use client';

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
      <div className="bg-white dark:bg-[#181a1d] rounded-none overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.28),0_0_20px_rgba(0,0,0,0.15)] dark:shadow-[0_0_55px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.85)] border border-gray-200/90 dark:border-zinc-800">
        <div className="bg-zinc-50 dark:bg-zinc-900 px-5 py-3.5 flex justify-between items-center border-b border-gray-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2 truncate pr-2">
            <AppIcon name={activeTab === 'er' ? 'hospital' : 'stethoscope'} size={18} strokeWidth={2} />
            <h3 className="font-bold text-zinc-900 dark:text-white text-base tracking-tight truncate">
              {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-none text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors"
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs">
              <AppIcon name="pin" size={14} />
              <span>{item.address}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200 font-bold text-xs">
              <AppIcon name="phone" size={14} />
              <a href={`tel:${item.tel}`} className="hover:underline">{item.tel}</a>
            </div>
          </div>

          {activeTab === 'er' && item.availableBeds !== undefined && (
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-none border border-zinc-200/80 dark:border-zinc-700 flex justify-between items-center">
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">응급실 가용 병상</span>
                <div className="font-bold text-base text-zinc-900 dark:text-white mt-0.5">
                  {item.availableBeds} / {item.totalBeds} 석
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-none border ${
                item.status === 'good' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' :
                item.status === 'normal' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400' :
                'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
              }`}>
                {getStatusText(item.status)}
              </span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <a
              href={`tel:${item.tel}`}
              className="flex-1 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 shadow-xs"
            >
              <AppIcon name="phone" size={14} />
              <span>전화걸기</span>
            </a>
            <a
              href={`https://map.kakao.com/link/to/${item.name},${item.lat},${item.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold text-center border border-gray-200/90 dark:border-zinc-800 flex items-center justify-center gap-1.5 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-2xs"
            >
              <AppIcon name="navigation" size={14} />
              <span>길찾기</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
