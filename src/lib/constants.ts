import { AppIconName } from '@/components/ui/AppIcon';

export function getCategoryIcon(name: string): AppIconName {
  if (name.includes('지원금') || name.includes('복지')) return 'bank';
  if (name.includes('건강') || name.includes('의료')) return 'hospital';
  if (name.includes('문화') || name.includes('축제')) return 'party-popper';
  if (name.includes('생활') || name.includes('교통')) return 'shield-check';
  return 'list';
}


