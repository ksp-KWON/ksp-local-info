import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

const dataFilePath = path.join(process.cwd(), 'public/data/local-info.json');

// 데이터 읽기 API
export async function GET() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ events: [], benefits: [], lastUpdated: '' });
    }
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '데이터를 읽을 수 없습니다.' }, { status: 500 });
  }
}

// 데이터 저장 API
export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { events, benefits } = body;

    if (!Array.isArray(events) || !Array.isArray(benefits)) {
      return NextResponse.json({ error: '올바르지 않은 데이터 형식입니다.' }, { status: 400 });
    }

    // 오늘 날짜 갱신
    const today = new Date().toISOString().split('T')[0];
    const updatedData = {
      events,
      benefits,
      lastUpdated: today
    };

    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: '데이터가 성공적으로 저장되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '데이터 저장 도중 오류가 발생했습니다.' }, { status: 500 });
  }
}
