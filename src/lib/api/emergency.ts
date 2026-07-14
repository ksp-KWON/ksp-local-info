export interface EmergencyItem {
  id: string;
  name: string;
  address: string;
  tel: string;
  lat: number;
  lng: number;
  availableBeds?: number;
  totalBeds?: number;
  status?: string;
  updatedAt?: string;
  hours?: string;
  isNightOpen?: boolean;
}

// Mock 데이터: 응급실
export const mockERs = [
  {
    id: 'er1', name: '가톨릭대학교 의정부성모병원', address: '경기도 의정부시 천보로 271 (금오동)',
    tel: '031-820-3000', lat: 37.7584, lng: 127.0754, availableBeds: 12, totalBeds: 45, status: 'good', updatedAt: '방금 전',
  },
  {
    id: 'er2', name: '의정부을지대학교병원', address: '경기도 의정부시 동일로 712 (금오동)',
    tel: '1899-0001', lat: 37.7516, lng: 127.0631, availableBeds: 2, totalBeds: 30, status: 'busy', updatedAt: '3분 전',
  },
  {
    id: 'er3', name: '의정부백병원', address: '경기도 의정부시 둔야로 11 (신곡동)',
    tel: '031-836-1119', lat: 37.7389, lng: 127.0503, availableBeds: 8, totalBeds: 15, status: 'normal', updatedAt: '5분 전',
  },
];

// Mock 데이터: 휴일/심야 약국
export const mockPharmacies = [
  {
    id: 'ph1', name: '의정부제일약국', address: '경기도 의정부시 평화로 542 (의정부동)',
    tel: '031-846-2244', lat: 37.7395, lng: 127.0458, hours: '매일 09:00 ~ 23:00', isNightOpen: true,
  },
  {
    id: 'ph2', name: '민락탑약국', address: '경기도 의정부시 오목로 225 (민락동)',
    tel: '031-851-7788', lat: 37.7460, lng: 127.0980, hours: '휴일 10:00 ~ 22:00', isNightOpen: false,
  },
  {
    id: 'ph3', name: '호원메디컬약국', address: '경기도 의정부시 평화로 230 (호원동)',
    tel: '031-826-1122', lat: 37.7180, lng: 127.0460, hours: '심야 22:00 ~ 02:00', isNightOpen: true,
  },
];

export type TabType = 'er' | 'pharmacy';

export async function fetchEmergencyData(type: TabType, apiKey: string) {
  const url = type === 'er'
    ? `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=${apiKey}&STAGE1=${encodeURIComponent('경기도')}&STAGE2=${encodeURIComponent('의정부시')}&pageNo=1&numOfRows=50`
    : `https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire?serviceKey=${apiKey}&Q0=${encodeURIComponent('경기도')}&Q1=${encodeURIComponent('의정부시')}&pageNo=1&numOfRows=100`;

  const res = await fetch(url);
  const xmlText = await res.text();

  if (xmlText.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR') || !xmlText.includes('<item>')) {
    throw new Error('API Key syncing or no data');
  }

  // 표준 DOMParser를 사용한 안전한 XML 파싱
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const items = Array.from(xmlDoc.querySelectorAll('item'));

  return items.map((item) => {
    const getText = (tag: string) => item.querySelector(tag)?.textContent || '';
    const dutyName = getText('dutyName');
    const wgs84Lat = parseFloat(getText('wgs84Lat')) || 37.7380;
    const wgs84Lon = parseFloat(getText('wgs84Lon')) || 127.0450;

    if (type === 'er') {
      const hvec = parseInt(getText('hvec') || '0', 10);
      return {
        id: dutyName,
        name: dutyName,
        address: getText('dutyAddr') || '의정부시',
        tel: getText('dutyTel3') || '전화번호 없음',
        lat: wgs84Lat,
        lng: wgs84Lon,
        availableBeds: hvec,
        totalBeds: hvec + 10,
        status: hvec > 5 ? 'good' : (hvec > 0 ? 'normal' : 'busy'),
        updatedAt: '방금 전',
      };
    } else {
      return {
        id: dutyName,
        name: dutyName,
        address: getText('dutyAddr') || '의정부시',
        tel: getText('dutyTel1') || '전화번호 없음',
        lat: wgs84Lat,
        lng: wgs84Lon,
        hours: '영업시간 확인 요망',
        isNightOpen: dutyName.includes('심야') || dutyName.includes('365'),
      };
    }
  });
}
