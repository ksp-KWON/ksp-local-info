import React from 'react';
import { Coins, PartyPopper, Stethoscope, Lightbulb, Baby, Briefcase, Home, Bus } from 'lucide-react';

export const CATEGORIES = [
  { id: '복지·지원금', label: '복지·지원금', keywords: ['지원금', '혜택', '복지', '장려금', '수당'], title: '최신 복지·지원금 소식', desc: '의정부시의 다양한 복지 및 지원금 혜택을 모아보세요.' },
  { id: '문화·행사', label: '문화·행사', keywords: ['행사', '축제', '문화', '공연', '콘서트', '전시'], title: '우리동네 문화·행사', desc: '의정부시 지역 행사와 축제 소식을 모아보세요.' },
  { id: '교육·육아', label: '교육·육아', keywords: ['교육', '육아', '보육', '어린이', '유아', '학비', '돌봄'], title: '우리아이 교육·육아 정보', desc: '의정부시의 교육, 보육, 육아 혜택 소식을 정리했습니다.' },
  { id: '건강·의료', label: '건강·의료', keywords: ['의료', '건강', '병원', '보건', '진료'], title: '건강·의료 생활 정보', desc: '의정부시의 건강 및 의료 관련 정보를 모아보세요.' },
  { id: '일자리·창업', label: '일자리·창업', keywords: ['일자리', '창업', '취업', '구인구직', '멘토링', '청년'], title: '일자리 및 창업 지원', desc: '의정부시 취업 및 창업, 멘토링 관련 소식을 확인하세요.' },
  { id: '주거·부동산', label: '주거·부동산', keywords: ['주거', '부동산', '월세', '임대', '주택', '전세'], title: '안정적인 주거 생활', desc: '의정부시의 주택, 월세 지원, 부동산 정보를 제공합니다.' },
  { id: '교통·환경', label: '교통·환경', keywords: ['교통', '환경', '버스', '지하철', '친환경', '에코'], title: '편리한 교통 및 환경', desc: '의정부 대중교통 및 환경 개선 정책 정보를 모았습니다.' },
  { id: '생활·민원', label: '생활·민원', keywords: ['정보', '민원', '생활', '기타'], title: '꼭 알아야 할 생활 꿀팁', desc: '의정부시의 유용한 생활 및 민원 정보를 모아보세요.' }
];

export const getCategoryTheme = (category: string) => {
  if (category.includes('복지') || category.includes('지원금') || category.includes('혜택')) {
    return { title: '최신 복지·지원금 소식', icon: Coins, color: 'green' as const };
  }
  if (category.includes('행사') || category.includes('문화') || category.includes('축제')) {
    return { title: '우리동네 문화·행사', icon: PartyPopper, color: 'pink' as const };
  }
  if (category.includes('교육') || category.includes('육아')) {
    return { title: '우리아이 교육·육아 정보', icon: Baby, color: 'yellow' as const };
  }
  if (category.includes('건강') || category.includes('의료')) {
    return { title: '건강·의료 생활 정보', icon: Stethoscope, color: 'blue' as const };
  }
  if (category.includes('일자리') || category.includes('창업')) {
    return { title: '일자리 및 창업 지원', icon: Briefcase, color: 'red' as const };
  }
  if (category.includes('주거') || category.includes('부동산')) {
    return { title: '안정적인 주거 생활', icon: Home, color: 'orange' as const };
  }
  if (category.includes('교통') || category.includes('환경')) {
    return { title: '편리한 교통 및 환경', icon: Bus, color: 'cyan' as const };
  }
  return { title: '꼭 알아야 할 생활 꿀팁', icon: Lightbulb, color: 'purple' as const };
};
