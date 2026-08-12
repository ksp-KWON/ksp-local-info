import { Metadata } from 'next';
import EmergencyMapWidget from '@/components/emergency/EmergencyMapWidget';

export const metadata: Metadata = {
  title: '의정부 야간 약국 & 응급실 실시간 병상 현황 | 보상스쿨',
  description: '의정부시 달빛어린이병원, 심야/휴일 지킴이 약국, 실시간 응급실 병상 정보를 지도에서 한눈에 확인하세요.',
  alternates: {
    canonical: '/services/emergency',
  },
};

export default function EmergencyPage() {
  return (
    <div className="pb-8">
      <EmergencyMapWidget isWidget={false} />
    </div>
  );
}
