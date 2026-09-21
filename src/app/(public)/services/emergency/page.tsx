import { Metadata } from 'next';
import EmergencyMapWidget from '@/components/emergency/EmergencyMapWidget';

export const metadata: Metadata = {
  title: '의정부 달빛어린이병원·응급실·심야약국 안내',
  description: '의정부시 달빛어린이병원, 응급실, 심야·휴일 지킴이 약국의 위치와 전화번호를 지도에서 확인하세요. 실시간 병상·운영 여부는 공식 사이트 링크로 확인할 수 있습니다.',
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
