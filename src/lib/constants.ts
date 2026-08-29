import { AppIconName } from '@/components/ui/AppIcon';

export interface CategoryItem {
  id: string;
  label: string;
  name: string;
  iconName: AppIconName;
  watermarkIcon: AppIconName;
  keywords: string[];
  title: string;
  desc: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'benefits',
    label: '숨은 지원금 찾기',
    name: '숨은 지원금 찾기',
    iconName: 'bank',
    watermarkIcon: 'bank',
    keywords: ['지원금', '혜택', '복지', '장려금', '수당', '기본소득', '청년지원'],
    title: '최신 복지·지원금 소식',
    desc: '의정부시와 경기도에서 지원하는 청년·주거·생활 안정 지원금 소식입니다.',
  },
  {
    id: 'events',
    label: '이번주 뭐하지?',
    name: '이번주 뭐하지?',
    iconName: 'party-popper',
    watermarkIcon: 'compass',
    keywords: ['행사', '축제', '문화', '공연', '콘서트', '전시', '도서관', '극장'],
    title: '우리동네 문화·행사',
    desc: '의정부시 지역 행사, 북콘서트, 축제 및 문화예술 소식을 모아보세요.',
  },
  {
    id: 'family',
    label: '우리 아이 혜택',
    name: '우리 아이 혜택',
    iconName: 'heart',
    watermarkIcon: 'heart',
    keywords: ['교육', '육아', '보육', '어린이', '유아', '학비', '돌봄', '출산', '임산부', '아동'],
    title: '우리아이 교육·육아 정보',
    desc: '출산축하금, 첫만남이용권, 육아 돌봄 서비스 등 가족을 위한 혜택입니다.',
  },
  {
    id: 'health',
    label: '아플 때 든든하게',
    name: '아플 때 든든하게',
    iconName: 'hospital',
    watermarkIcon: 'hospital',
    keywords: ['의료', '건강', '병원', '보건', '진료', '약국', '검진', '응급'],
    title: '건강·의료 생활 정보',
    desc: '달빛어린이병원, 심야약국, 무료 건강검진 등 필수 응급의료 안내입니다.',
  },
  {
    id: 'jobs',
    label: '취업과 창업',
    name: '취업과 창업',
    iconName: 'trending-up',
    watermarkIcon: 'trending-up',
    keywords: ['일자리', '창업', '취업', '구인구직', '멘토링', '청년', '면접'],
    title: '일자리 및 창업 지원',
    desc: '의정부 일자리 박람회, 청년 면접 지원, 창업 인큐베이팅 공고를 모았습니다.',
  },
  {
    id: 'housing',
    label: '슬기로운 주거생활',
    name: '슬기로운 주거생활',
    iconName: 'home',
    watermarkIcon: 'home',
    keywords: ['주거', '부동산', '월세', '임대', '주택', '전세', '이사', '청약'],
    title: '안정적인 주거 생활',
    desc: '의정부시의 청년 월세 지원, 이사비 지원, 주택 및 부동산 정보를 제공합니다.',
  },
  {
    id: 'traffic',
    label: '출퇴근과 교통',
    name: '출퇴근과 교통',
    iconName: 'bus',
    watermarkIcon: 'navigation',
    keywords: ['교통', '환경', '버스', '지하철', '친환경', '에코', '도로', '환승'],
    title: '편리한 교통 및 환경',
    desc: '의정부 대중교통 노선, 환승 혜택 및 환경 개선 정책 정보를 모았습니다.',
  },
  {
    id: 'tips',
    label: '알아두면 쓸데있는 팁',
    name: '알아두면 쓸데있는 팁',
    iconName: 'shield-check',
    watermarkIcon: 'shield-check',
    keywords: ['정보', '민원', '생활', '기타', '팁', '신청', '주민센터', '정부24'],
    title: '꼭 알아야 할 생활 꿀팁',
    desc: '의정부시의 유용한 행정복지센터 민원 처리 및 생활 노하우를 모아보세요.',
  },
];
