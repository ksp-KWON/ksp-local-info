import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export const dynamic = 'force-static';

export async function POST() {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate-local-news.js');
    
    // Fire and forget: 비동기로 백그라운드에서 실행하고 응답은 즉시 반환
    // (서버리스 환경이 아닐 경우 백그라운드 프로세스로 잘 동작함)
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[AI 생성 에러]: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`[AI 생성 STDERR]: ${stderr}`);
        return;
      }
      console.log(`[AI 생성 성공]:\n${stdout}`);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'AI 블로그 글 작성을 백그라운드에서 시작합니다.' 
    });
  } catch (error: any) {
    console.error('API Error starting AI generate: ', error);
    return NextResponse.json({ success: false, error: '스크립트 실행 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
