import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';
import { getSortedPostsData, getPostData } from '@/lib/posts';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// 1. 포스트 목록 또는 특정 포스트 상세 가져오기
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = getPostData(slug);
      if (!post) {
        return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    const posts = getSortedPostsData();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: '포스트 목록을 불러올 수 없습니다.' }, { status: 500 });
  }
}

// 2. 포스트 생성 및 수정
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { originalSlug, slug, title, date, summary, category, tags, content } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: '슬러그(파일명), 제목, 본문 내용은 필수 항목입니다.' }, { status: 400 });
    }

    // 슬러그 포맷 정리 (영문 소문자, 숫자, 하이픈만 허용하도록 간단히 처리하거나 파일명 형식 맞춤)
    const formattedSlug = slug.trim().replace(/\s+/g, '-').toLowerCase();

    // 기존 슬러그가 존재하고 새 슬러그와 다르면 기존 파일 삭제 (이름 변경 처리)
    if (originalSlug && originalSlug !== formattedSlug) {
      const oldPath = path.join(postsDirectory, `${originalSlug}.md`);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const newPath = path.join(postsDirectory, `${formattedSlug}.md`);

    // 태그 배열 정리
    let tagArray: string[] = [];
    if (Array.isArray(tags)) {
      tagArray = tags.map(t => t.trim());
    } else if (typeof tags === 'string') {
      tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    // frontmatter 마크다운 텍스트 생성
    const frontmatter = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `date: ${date || new Date().toISOString().split('T')[0]}`,
      `summary: ${JSON.stringify(summary || '')}`,
      `category: ${JSON.stringify(category || '')}`,
      `tags: ${JSON.stringify(tagArray)}`,
      '---',
      '',
      content
    ].join('\n');

    fs.writeFileSync(newPath, frontmatter, 'utf8');

    return NextResponse.json({ success: true, slug: formattedSlug, message: '글이 성공적으로 저장되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '글 저장 도중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 3. 포스트 삭제
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: '삭제할 포스트의 슬러그가 필요합니다.' }, { status: 400 });
    }

    const targetPath = path.join(postsDirectory, `${slug}.md`);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      return NextResponse.json({ success: true, message: '포스트가 삭제되었습니다.' });
    } else {
      return NextResponse.json({ error: '해당 포스트 파일을 찾을 수 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: '포스트 삭제 도중 오류가 발생했습니다.' }, { status: 500 });
  }
}
