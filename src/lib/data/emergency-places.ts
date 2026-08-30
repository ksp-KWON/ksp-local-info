/**
 * src/lib/data/emergency-places.ts
 * 의정부시 관내 주요 응급실, 달빛어린이병원, 심야약국 마스터 데이터
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
      '경기북부 권역외상센터 지정',
      '24시간 응급의학과 전문의 상주',
      '소아 응급 중환자 집중 치료',
      '심뇌혈관 중증 응급 질환 특화',
    ],
    description: '가톨릭대학교 의정부성모병원은 경기북부 유일의 권역응급의료센터 및 권역외상센터를 운영하는 상급종합병원으로, 24시간 중증 응급 환자 및 외상 환자 처치가 가능합니다.',
    departments: ['응급의학과', '소아청소년과', '신경외과', '심장내과', '정형외과', '외과'],
    parkingInfo: '응급실 내원 시 24시간 무료 주차 지원',
    emergencyLevel: '권역응급의료센터 (최상급)',
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
      '최첨단 스마트 응급의료 시스템',
      '24시간 소아청소년과 응급 진료',
      '헬리패드 완비 항공이송 지원',
      '감염격리 음압병상 운영',
    ],
    description: '의정부을지대학교병원은 최신 의료 장비와 음압 격리 시설을 갖춘 지역응급의료센터로, 성인 및 소아 응급 질환에 대한 신속한 당직 진료를 제공합니다.',
    departments: ['응급의학과', '소아청소년과', '신경과', '정형외과', '내과'],
    parkingInfo: '응급 진료 환자 24시간 무료 주차',
    emergencyLevel: '지역응급의료센터',
  },
  {
    slug: 'uijeongbu-paik-hospital',
    name: '의정부백병원 응급실',
    type: 'hospital',
    typeName: '지역응급의료기관',
    address: '경기도 의정부시 둔야로 11 (신곡동)',
    tel: '031-836-1119',
    lat: 37.7389,
    lng: 127.0503,
    hours: {
      weekday: '24시간 연중무휴',
      weekend: '24시간 연중무휴',
      holiday: '24시간 연중무휴',
    },
    features: [
      '24시간 응급진료실 운영',
      '신속한 일반 외상 및 급성기 처치',
      'CT 및 X-ray 24시간 검사 가능',
    ],
    description: '의정부백병원은 신곡동 및 의정부역 인근 주민들을 위한 24시간 지역응급의료기관으로, 급성 복통, 골절, 열성 질환 등의 신속한 1차 응급 처치를 수행합니다.',
    departments: ['응급의학과', '정형외과', '내과', '외과'],
    parkingInfo: '병원 전용 주차장 완비',
    emergencyLevel: '지역응급의료기관',
  },
  {
    slug: 'uijeongbu-tntn-children-hospital',
    name: '튼튼어린이병원 (지정 달빛어린이병원)',
    type: 'moonlight',
    typeName: '보건복지부 지정 달빛어린이병원',
    address: '경기도 의정부시 평화로 320 (호원동, 회룡역 인근)',
    tel: '031-879-8575',
    lat: 37.7230,
    lng: 127.0465,
    hours: {
      weekday: '09:00 ~ 23:00',
      weekend: '09:00 ~ 22:00',
      holiday: '09:00 ~ 22:00',
    },
    features: [
      '보건복지부 공식 지정 달빛어린이병원',
      '소아청소년과 전문의 야간·휴일 직접 진료',
      '응급실 대비 진료비 70% 이상 절감 (외래 본인부담금 적용)',
      '인근 협약 공공심야약국 처방전 즉시 조제',
    ],
    description: '튼튼어린이병원은 의정부시 대표 달빛어린이병원으로, 야간과 공휴일에도 소아청소년과 전문의가 상주하여 응급실 관리료 부담 없이 합리적인 비용으로 소아 진료를 제공합니다.',
    departments: ['소아청소년과', '소아호흡기알레르기', '소아소화기', '영유아검진'],
    parkingInfo: '건물 지하 주차장 2시간 무료 지원',
    emergencyLevel: '공공 소아 야간외래 기관',
  },
  {
    slug: 'uijeongbu-jeil-pharmacy',
    name: '의정부제일약국 (공공심야약국)',
    type: 'pharmacy',
    typeName: '공공심야약국',
    address: '경기도 의정부시 평화로 542 (의정부동, 의정부역 인근)',
    tel: '031-846-2244',
    lat: 37.7395,
    lng: 127.0458,
    hours: {
      weekday: '09:00 ~ 23:00',
      weekend: '09:00 ~ 23:00',
      holiday: '09:00 ~ 23:00',
    },
    features: [
      '심야 시간대 처방전 전문 조제',
      '소아 해열제 및 상비의약품 항시 구비',
      '전문 약사 복약 지도 및 상담',
      '의정부사랑카드 결제 가능',
    ],
    description: '의정부제일약국은 의정부역 중심가에 위치한 공공심야약국으로, 야간 병원 진료 후 처방 의약품 조제와 비상 상비약 구매가 가능합니다.',
    parkingInfo: '인근 공영주차장 이용 권장',
  },
  {
    slug: 'howon-medical-pharmacy',
    name: '호원메디컬약국 (달빛 연계 심야약국)',
    type: 'pharmacy',
    typeName: '달빛어린이병원 연계약국',
    address: '경기도 의정부시 평화로 230 (호원동, 망월사역 인근)',
    tel: '031-826-1122',
    lat: 37.7180,
    lng: 127.0460,
    hours: {
      weekday: '09:00 ~ 24:00',
      weekend: '09:00 ~ 24:00',
      holiday: '09:00 ~ 24:00',
    },
    features: [
      '달빛어린이병원 처방전 원스톱 조제',
      '어린이 전용 시럽제 및 가루약 조제 특화',
      '자정(24:00)까지 연중무휴 영업',
    ],
    description: '호원메디컬약국은 망월사역 인근 및 호원동 권역의 대표 야간 약국으로, 달빛어린이병원 진료 환아의 처방전을 밤 12시까지 전문 조제합니다.',
    parkingInfo: '건물 주차장 이용 가능',
  },
  {
    slug: 'minlak-top-pharmacy',
    name: '민락탑약국 (민락지구 휴일지킴이약국)',
    type: 'pharmacy',
    typeName: '휴일지킴이약국',
    address: '경기도 의정부시 오목로 225 (민락동, 민락2지구)',
    tel: '031-851-7788',
    lat: 37.7460,
    lng: 127.0980,
    hours: {
      weekday: '09:00 ~ 22:00',
      weekend: '10:00 ~ 22:00',
      holiday: '10:00 ~ 22:00',
    },
    features: [
      '민락2지구 중심상가 위치',
      '주말 및 공휴일 밤 10시까지 운영',
      '영유아 영양제 및 응급 처치용품 구비',
    ],
    description: '민락탑약국은 민락지구 주민들을 위한 휴일지킴이 약국으로, 주말과 공휴일에도 밤 10시까지 문을 열어 긴급한 의약품 수급을 지원합니다.',
    parkingInfo: '상가 지하 주차장 완비',
  }
];

export function getEmergencyPlaceBySlug(slug: string): EmergencyPlace | undefined {
  return EMERGENCY_PLACES.find((p) => p.slug === slug);
}
