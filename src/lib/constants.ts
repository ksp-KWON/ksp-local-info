import React from 'react';
import { Coins, PartyPopper, Stethoscope, Lightbulb } from 'lucide-react';

export const CATEGORIES = [
  { id: '혜택', label: '복지·지원금', keywords: ['지원금', '혜택', '복지'], title: '최신 복지·지원금 소식', desc: '의정부시의 다양한 복지 및 지원금 혜택을 모아보세요.' },
  { id: '행사', label: '행사·축제', keywords: ['행사', '축제', '문화'], title: '우리동네 문화·행사', desc: '의정부시 지역 행사와 축제 소식을 모아보세요.' },
  { id: '의료', label: '건강·의료', keywords: ['의료', '건강', '병원'], title: '건강·의료 생활 정보', desc: '의정부시의 건강 및 의료 관련 정보를 모아보세요.' },
  { id: '정보', label: '생활정보', keywords: ['정보', '민원', '기타'], title: '꼭 알아야 할 생활 꿀팁', desc: '의정부시의 유용한 생활 및 민원 정보를 모아보세요.' }
];

export const getCategoryTheme = (category: string) => {
  if (category === '복지·지원금' || category === '혜택' || category.includes('지원금') || category.includes('복지')) {
    return { title: '최신 복지·지원금 소식', icon: Coins, color: 'green' as const };
  }
  if (category === '행사·축제' || category === '행사' || category.includes('행사') || category.includes('문화')) {
    return { title: '우리동네 문화·행사', icon: PartyPopper, color: 'pink' as const };
  }
  if (category === '건강·의료' || category === '의료' || category.includes('의료') || category.includes('건강')) {
    return { title: '건강·의료 생활 정보', icon: Stethoscope, color: 'blue' as const };
  }
  return { title: '꼭 알아야 할 생활 꿀팁', icon: Lightbulb, color: 'yellow' as const };
};
