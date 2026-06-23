import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

const medicalFilePath = path.join(process.cwd(), 'public/data/medical-info.json');

// 병원 정보 읽기
export async function GET() {
  try {
    if (!fs.existsSync(medicalFilePath)) {
      return NextResponse.json([]);
    }
    const fileContents = fs.readFileSync(medicalFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: '병원 데이터를 읽을 수 없습니다.' }, { status: 500 });
  }
}

// 병원 정보 저장 및 CRUD 전체 업데이트
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: '올바르지 않은 데이터 형식입니다.' }, { status: 400 });
    }

    fs.writeFileSync(medicalFilePath, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true, message: '병원 정보가 저장되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '병원 정보 저장 실패' }, { status: 500 });
  }
}
