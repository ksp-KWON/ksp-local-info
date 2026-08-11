import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-static';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts');

// Helper to ensure directory exists
const ensureDir = () => {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
};

export async function GET(request: Request) {
  try {
    ensureDir();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // 단일 포스트 조회
    if (slug) {
      const filePath = path.join(POSTS_DIR, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      return NextResponse.json({
        slug,
        title: data.title || '',
        date: data.date || '',
        summary: data.summary || '',
        category: data.category || '',
        tags: data.tags || [],
        content: content || ''
      });
    }

    // 전체 포스트 목록 조회
    const fileNames = fs.readdirSync(POSTS_DIR);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const fileSlug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(POSTS_DIR, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug: data.slug || fileSlug,
          title: data.title || '',
          date: data.date || '',
          summary: data.summary || '',
          category: data.category || '',
          tags: data.tags || [],
        };
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    return NextResponse.json(allPostsData);
  } catch (error) {
    console.error('Error in GET /api/admin/posts:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return handleSave(request);
}

export async function PUT(request: Request) {
  return handleSave(request);
}

async function handleSave(request: Request) {
  try {
    ensureDir();
    const body = await request.json();
    const { slug, originalSlug, title, date, summary, category, tags, content } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: '슬러그가 누락되었습니다.' }, { status: 400 });
    }

    // 원래 슬러그가 변경된 경우 기존 파일 삭제
    if (originalSlug && originalSlug !== slug) {
      const oldPath = path.join(POSTS_DIR, `${originalSlug}.md`);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const filePath = path.join(POSTS_DIR, `${slug}.md`);

    // 프론트매터 데이터 생성
    const frontmatter = {
      title,
      date,
      summary,
      category,
      tags,
      slug
    };

    // 파일 쓰기 (gray-matter stringify)
    const fileContent = matter.stringify(content || '', frontmatter);
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ success: false, error: '저장 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: '슬러그가 없습니다.' }, { status: 400 });
    }

    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: '포스트를 찾을 수 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ success: false, error: '삭제 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
