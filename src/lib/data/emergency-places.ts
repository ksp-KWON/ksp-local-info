/**
 * src/lib/data/emergency-places.ts
 * 의정부시 관내 응급실 마스터 데이터(공식 출처 대조 후 확장 예정)
 * (프로그래매틱 SEO 및 개별 상세페이지 SSG 렌더링용)
 */

export interface EmergencyPlace {
  slug: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'moonlight';
  typeName: string;
  address: string;
  tel: string;
  lat: number;
  lng: number;
  hours: {
    weekday: string;
    weekend: string;
    holiday: string;
  };
  features: string[];
  description: string;
  departments?: string[];
  parkingInfo?: string;
  emergencyLevel?: string;
}

export const EMERGENCY_PLACES: EmergencyPlace[] = [
  {
    slug: 'uijeongbu-st-marys-hospital',
    name: '가톨릭대학교 의정부성모병원 응급의료센터',
    type: 'hospital',
    typeName: '권역응급의료센터',
    address: '경기도 의정부시 천보로 271 (금오동)',
    tel: '031-820-3000',
    lat: 37.7584,
    lng: 127.0754,
    hours: {
      weekday: '24시간 연중무휴',
      weekend: '24시간 연중무휴',
      holiday: '24시간 연중무휴',
    },
    features: [
      '경기북부 권역응급의료센터 및 권역외상센터 24시간 상시 가동',
      '소아응급·심뇌혈관·중증외상 전문의 당직 진료 및 응급 수술 연계 체계',
      '내원 전 119 구급대 및 대표전화(031-820-3000)를 통한 실시간 병상·진료 가능 여부 확인 권장',
    ],
    departments: ['응급의학과', '외상외과', '소아청소년과', '신경외과', '심장내과', '정형외과'],
    parkingInfo: '응급의료센터 진료 환자 및 보호자 차량 원내 주차장 이용 가능 (수납 시 차량번호 등록)',
    emergencyLevel: '권역응급의료센터',
    description: '경기북부 중증 응급환자 진료를 담당하는 가톨릭대학교 의정부성모병원 권역응급의료센터의 위치·전화번호·운영시간 및 진료 안내입니다.',
  },
  {
    slug: 'uijeongbu-eulji-university-hospital',
    name: '의정부을지대학교병원 응급의료센터',
    type: 'hospital',
    typeName: '지역응급의료센터',
    address: '경기도 의정부시 동일로 712 (금오동)',
    tel: '1899-0001',
    lat: 37.7516,
    lng: 127.0631,
    hours: {
      weekday: '24시간 연중무휴',
      weekend: '24시간 연중무휴',
      holiday: '24시간 연중무휴',
    },
    features: [
      '지역응급의료센터 24시간 연중무휴 응급의학과 전문의 상주 진료',
      '급성 심근경색·뇌졸중 등 심뇌혈관 응급 시술 및 중환자 집중치료실 연계 운영',
      '야간·공휴일 내원 시 신분증 지참 필수 및 대표전화(1899-0001) 사전 문의 권장',
    ],
    departments: ['응급의학과', '내과', '외과', '소아청소년과', '신경과', '산부인과'],
    parkingInfo: '병원 지하 및 지상 주차장 24시간 운영 (응급실 수납창구 차량 등록 시 주차 감면 적용)',
    emergencyLevel: '지역응급의료센터',
    description: '의정부을지대학교병원 지역응급의료센터의 24시간 응급 진료 안내, 위치, 대표전화 및 주차 이용 가이드입니다.',
  },
];

export function getEmergencyPlaceBySlug(slug: string): EmergencyPlace | undefined {
  return EMERGENCY_PLACES.find((p) => p.slug === slug);
}
