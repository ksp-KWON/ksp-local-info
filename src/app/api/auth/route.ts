import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, isAuthenticated } from '@/lib/auth';
import { cookies } from 'next/headers';

// 로그인 여부 확인
export async function GET() {
  const authenticated = await isAuthenticated();
  return NextResponse.json({ authenticated });
}

// 로그인 실행
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || '1234';

    if (password === correctPassword) {
      const token = createSessionToken();
      const cookieStore = await cookies();
      
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/',
      });

      return NextResponse.json({ success: true, message: '로그인 성공' });
    }

    return NextResponse.json(
      { success: false, message: '비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 로그아웃 실행
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true, message: '로그아웃 성공' });
}
