import { AppIconName } from '@/components/ui/AppIcon';

export const SITE_URL = 'https://uijeongbusim.com';
export const SITE_DOMAIN = 'uijeongbusim.com';
export const SITE_NAME = '의정부심 (의정부 건강·생활 정보 포털)';
export const GA_MEASUREMENT_ID = 'G-11X7FX7P1Q';
export const NAVER_SITE_VERIFICATION = '17d7828ffa44b9ac00d06745104e11c4c0deb69f';

export const CIVIC_CATEGORIES = [
  '일자리·생활',
  '교통·주차',
  '기업경제·농업',
  '문화·예술',
  '체육·공원',
  '청소·환경',
  '주택·재개발',
  '재난·민방위',
  '복지·돌봄',
] as const;

export type CivicCategory = (typeof CIVIC_CATEGORIES)[number];

export function getCategoryIcon(name: string): AppIconName {
  if (name.includes('교통') || name.includes('주차')) return 'car';
  if (name.includes('청소') || name.includes('환경') || name.includes('폐기물')) return 'trash';
  if (name.includes('주택') || name.includes('재개발') || name.includes('건축')) return 'home';
  if (name.includes('재난') || name.includes('민방위') || name.includes('안전')) return 'shield-alert';
  if (name.includes('문화') || name.includes('예술') || name.includes('공연') || name.includes('전시') || name.includes('축제')) return 'sparkles';
  if (name.includes('체육') || name.includes('공원') || name.includes('산책') || name.includes('나들이')) return 'leaf';
  if (name.includes('경제') || name.includes('기업') || name.includes('농업') || name.includes('소상공인')) return 'bank';
  if (name.includes('일자리') || name.includes('생활') || name.includes('민원')) return 'file-text';
  if (name.includes('복지') || name.includes('돌봄') || name.includes('병원') || name.includes('건강')) return 'heart';
  return 'list';
}
