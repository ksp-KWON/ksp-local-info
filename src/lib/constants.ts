import { AppIconName } from '@/components/ui/AppIcon';

export const CIVIC_CATEGORIES = [
  '복지·지원금',
  '축제·나들이',
  '생활·민원',
  '병원·약국',
  '일자리·소상공인',
] as const;

export type CivicCategory = (typeof CIVIC_CATEGORIES)[number];

export function getCategoryIcon(name: string): AppIconName {
  if (name.includes('지원금') || name.includes('복지')) return 'bank';
  if (name.includes('축제') || name.includes('나들이') || name.includes('문화')) return 'party-popper';
  if (name.includes('생활') || name.includes('민원') || name.includes('교통')) return 'compass';
  if (name.includes('병원') || name.includes('약국') || name.includes('건강') || name.includes('의료')) return 'hospital';
  if (name.includes('일자리') || name.includes('소상공인') || name.includes('경제')) return 'file-text';
  return 'list';
}
