import { Metadata } from 'next';
import LocalCurrencyMapWidget from '@/components/local-currency/LocalCurrencyMapWidget';

export const metadata: Metadata = {
  title: '의정부 사랑카드 가맹점 실시간 지도 | 보상스쿨',
  description: '의정부 지역화폐(사랑카드)를 사용할 수 있는 내 주변 가맹점을 지도에서 쉽게 찾아보세요.',
  alternates: {
    canonical: '/services/local-currency',
  },
};

export default function LocalCurrencyMapPage() {
  return (
    <div className="pb-8">
      <LocalCurrencyMapWidget isWidget={false} />
    </div>
  );
}
