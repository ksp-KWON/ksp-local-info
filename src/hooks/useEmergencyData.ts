import { useState, useEffect } from 'react';
import { EmergencyItem, TabType, fetchEmergencyData, mockERs, mockPharmacies } from '@/lib/api/emergency';

export function useEmergencyData() {
  const [activeTab, setActiveTab] = useState<TabType>('er');
  const [selectedItem, setSelectedItem] = useState<EmergencyItem | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [realData, setRealData] = useState<EmergencyItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedItem(null);
     
    setIsDataLoading(true);
     
    setRealData([]);

    const loadData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_PUBLIC_DATA_API_KEY;
        if (!apiKey) throw new Error('No API Key');

        const items = await fetchEmergencyData(activeTab, apiKey);
        if (items && items.length > 0) {
          setRealData(items);
        }
      } catch (err) {
        console.error('Failed to fetch real API, falling back to mock:', err);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const currentData = realData.length > 0 
    ? realData 
    : (activeTab === 'er' ? mockERs : mockPharmacies);

  return {
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
    isDataLoading,
    currentData
  };
}
