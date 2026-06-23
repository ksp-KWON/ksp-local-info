import crypto from 'crypto';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'supersecret_hira_default_secret_key_1234';
const COOKIE_NAME = 'admin_session';

export interface SessionPayload {
  role: string;
  expires: number;
}

// 간단한 JWT 형태의 토큰 생성 (Payload.Signature)
export function createSessionToken(): string {
  const payload: SessionPayload = {
    role: 'admin',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7일간 유효
  };
  
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payloadBase64)
    .digest('hex');
    
  return `${payloadBase64}.${signature}`;
}

// 토큰 검증 함수
export function verifySessionToken(token: string): boolean {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return false;
    
    // 서명 검증
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(payloadBase64)
      .digest('hex');
      
    if (signature !== expectedSignature) return false;
    
    // 만료 시간 및 정보 검증
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload: SessionPayload = JSON.parse(payloadJson);
    
    if (payload.role !== 'admin') return false;
    if (payload.expires < Date.now()) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

// 쿠키에서 세션 확인
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie) return false;
  return verifySessionToken(sessionCookie.value);
}
