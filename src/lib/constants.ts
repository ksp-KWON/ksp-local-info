import React from 'react';
import { Coins, PartyPopper, Stethoscope, Lightbulb, Baby, Briefcase, Home, Bus } from 'lucide-react';

export const CATEGORIES = [
  { id: '💸 숨은 지원금 찾기', label: '💸 숨은 지원금 찾기', keywords: ['지원금', '혜택', '복지', '장려금', '수당'], title: '최신 복지·지원금 소식', desc: '의정부시의 다양한 복지 및 지원금 혜택을 모아보세요.' },
  { id: '🎉 이번주 뭐하지?', label: '🎉 이번주 뭐하지?', keywords: ['행사', '축제', '문화', '공연', '콘서트', '전시'], title: '우리동네 문화·행사', desc: '의정부시 지역 행사와 축제 소식을 모아보세요.' },
  { id: '👶 우리 아이 혜택', label: '👶 우리 아이 혜택', keywords: ['교육', '육아', '보육', '어린이', '유아', '학비', '돌봄'], title: '우리아이 교육·육아 정보', desc: '의정부시의 교육, 보육, 육아 혜택 소식을 정리했습니다.' },
  { id: '🩺 아플 때 든든하게', label: '🩺 아플 때 든든하게', keywords: ['의료', '건강', '병원', '보건', '진료'], title: '건강·의료 생활 정보', desc: '의정부시의 건강 및 의료 관련 정보를 모아보세요.' },
  { id: '💼 취업과 창업', label: '💼 취업과 창업', keywords: ['일자리', '창업', '취업', '구인구직', '멘토링', '청년'], title: '일자리 및 창업 지원', desc: '의정부시 취업 및 창업, 멘토링 관련 소식을 확인하세요.' },
  { id: '🏡 슬기로운 주거생활', label: '🏡 슬기로운 주거생활', keywords: ['주거', '부동산', '월세', '임대', '주택', '전세'], title: '안정적인 주거 생활', desc: '의정부시의 주택, 월세 지원, 부동산 정보를 제공합니다.' },
  { id: '🚌 출퇴근과 교통', label: '🚌 출퇴근과 교통', keywords: ['교통', '환경', '버스', '지하철', '친환경', '에코'], title: '편리한 교통 및 환경', desc: '의정부 대중교통 및 환경 개선 정책 정보를 모았습니다.' },
  { id: '💡 알아두면 쓸데있는 팁', label: '💡 알아두면 쓸데있는 팁', keywords: ['정보', '민원', '생활', '기타'], title: '꼭 알아야 할 생활 꿀팁', desc: '의정부시의 유용한 생활 및 민원 정보를 모아보세요.' }
];

export const getCategoryTheme = (category: string) => {
  if (category.includes('지원금') || category.includes('돈') || category.includes('복지')) {
    return { title: '최신 복지·지원금 소식', icon: Coins, color: 'green' as const };
  }
  if (category.includes('이번주') || category.includes('행사') || category.includes('축제')) {
    return { title: '우리동네 문화·행사', icon: PartyPopper, color: 'pink' as const };
  }
  if (category.includes('아이') || category.includes('육아')) {
    return { title: '우리아이 교육·육아 정보', icon: Baby, color: 'yellow' as const };
  }
  if (category.includes('아플 때') || category.includes('건강') || category.includes('의료')) {
    return { title: '건강·의료 생활 정보', icon: Stethoscope, color: 'blue' as const };
  }
  if (category.includes('취업') || category.includes('창업') || category.includes('일자리')) {
    return { title: '일자리 및 창업 지원', icon: Briefcase, color: 'red' as const };
  }
  if (category.includes('주거') || category.includes('부동산')) {
    return { title: '안정적인 주거 생활', icon: Home, color: 'orange' as const };
  }
  if (category.includes('교통') || category.includes('출퇴근')) {
    return { title: '편리한 교통 및 환경', icon: Bus, color: 'cyan' as const };
  }
  return { title: '꼭 알아야 할 생활 꿀팁', icon: Lightbulb, color: 'purple' as const };
};
