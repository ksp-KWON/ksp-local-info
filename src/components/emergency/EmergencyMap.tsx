import React from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { EmergencyItem, TabType } from '@/lib/api/emergency';

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
            <div 
              onClick={() => setSelectedItem(item)}
              className={`cursor-pointer px-3 py-1.5 bg-white dark:bg-[#202124] border-2 rounded-none-full shadow-2xl text-sm font-bold flex items-center gap-1.5 transition-transform hover:scale-105 ${
                item.status === 'busy' ? 'border-red-500 text-red-600 dark:text-red-400' :
                item.status === 'normal' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' :
                'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <span>🏥</span>
              <span>{item.availableBeds}베드</span>
            </div>
          ) : (
            <div 
              onClick={() => setSelectedItem(item)}
              className="cursor-pointer px-3 py-1.5 bg-white dark:bg-[#202124] border-2 border-[#2ed573] rounded-none-full shadow-2xl text-sm font-bold flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <span className="text-[#2ed573]">💊</span>
              <span className="text-gray-800 dark:text-white max-w-[80px] truncate">{item.name}</span>
            </div>
          )}
        </CustomOverlayMap>
      ))}
    </Map>
  );
}
