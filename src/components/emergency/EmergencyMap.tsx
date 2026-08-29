import React from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { EmergencyItem, TabType } from '@/lib/api/emergency';
import AppIcon from '@/components/ui/AppIcon';

interface EmergencyMapProps {
  mapCenter: { lat: number; lng: number };
  activeTab: TabType;
  currentData: EmergencyItem[];
  setSelectedItem: (item: EmergencyItem | null) => void;
}

export default function EmergencyMap({ mapCenter, activeTab, currentData, setSelectedItem }: EmergencyMapProps) {
  return (
    <Map
      center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
      style={{ width: '100%', height: '100%' }}
      level={4}
      onClick={() => setSelectedItem(null)}
    >
      {currentData.map((item) => (
        <CustomOverlayMap
          key={item.id}
          position={{ lat: item.lat, lng: item.lng }}
          yAnchor={1}
        >
          {activeTab === 'er' ? (
            <button 
              onClick={() => setSelectedItem(item)}
              className={`cursor-pointer px-2.5 py-1 bg-white dark:bg-[#181a1d] border rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 ${
                item.status === 'busy' ? 'border-rose-400 text-rose-700 dark:text-rose-300' :
                item.status === 'normal' ? 'border-amber-400 text-amber-700 dark:text-amber-300' :
                'border-emerald-400 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <AppIcon name="hospital" size={13} strokeWidth={2.5} />
              <span>{item.availableBeds}석</span>
            </button>
          ) : (
            <button 
              onClick={() => setSelectedItem(item)}
              className="cursor-pointer px-2.5 py-1 bg-white dark:bg-[#181a1d] border border-sky-400 dark:border-sky-600 rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <AppIcon name="stethoscope" size={13} strokeWidth={2.5} className="text-sky-600 dark:text-sky-400" />
              <span className="max-w-[84px] truncate">{item.name}</span>
            </button>
          )}
        </CustomOverlayMap>
      ))}
    </Map>
  );
}
