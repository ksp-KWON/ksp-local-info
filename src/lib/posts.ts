import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
  tags?: string[];
  content: string;
}

// 블로그 텍스트 내 콜론(:) 양옆 띄어쓰기 적용 함수 (URL, 시간은 예외 처리)
function formatColonSpacing(text: string): string {
  if (!text) return text;
  return text.replace(/([^\s\d])\s*:\s*([^\s\d/])/g, (match, p1, p2) => {
    // URL(http://, https://)의 경우 무시
    if ((p1 === 'p' || p1 === 's') && p2 === '/') return match;
    return `${p1} : ${p2}`;
  });
}

export function getSortedPostsData(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    let dateStr = matterResult.data.date;
    if (dateStr instanceof Date) {
      dateStr = dateStr.toISOString().split('T')[0];
    }

    return {
      slug,
      title: matterResult.data.title || '',
      date: dateStr || '',
      summary: matterResult.data.summary || '',
      category: matterResult.data.category || '',
      tags: matterResult.data.tags || [],
      content: formatColonSpacing(matterResult.content),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostData(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  let dateStr = matterResult.data.date;
  if (dateStr instanceof Date) {
    dateStr = dateStr.toISOString().split('T')[0];
  }

  return {
    slug,
    title: matterResult.data.title || '',
    date: dateStr || '',
    summary: matterResult.data.summary || '',
    category: matterResult.data.category || '',
    tags: matterResult.data.tags || [],
    content: formatColonSpacing(matterResult.content),
  };
}
