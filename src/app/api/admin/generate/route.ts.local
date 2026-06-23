import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    return new Promise<NextResponse>((resolve) => {
      exec(
        'node scripts/generate-blog-post.js',
        { env: { ...process.env } },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`AI 생성 에러: ${error.message}`);
            resolve(
              NextResponse.json(
                { success: false, error: error.message, details: stderr },
                { status: 500 }
              )
            );
          } else {
            console.log(`AI 생성 성공: ${stdout}`);
            resolve(
              NextResponse.json({
                success: true,
                message: 'Gemini AI 블로그 글이 성공적으로 자동 생성되었습니다.',
                output: stdout.trim(),
              })
            );
          }
        }
      );
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI 생성 처리 실패' }, { status: 500 });
  }
}
