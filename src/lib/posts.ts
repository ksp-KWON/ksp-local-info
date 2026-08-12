import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostData } from './types';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export function getSortedPostsData(): PostData[] {
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
    } else if (typeof dateStr === 'string' && dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }

    let categoryArray: string[] = [];
    if (matterResult.data.category) {
      if (Array.isArray(matterResult.data.category)) {
        categoryArray = matterResult.data.category;
      } else if (typeof matterResult.data.category === 'string') {
        categoryArray = matterResult.data.category.split(',').map(s => s.trim());
      }
    }

    return {
      slug,
      title: matterResult.data.title || '',
      date: dateStr || '',
      summary: matterResult.data.summary || '',
      category: categoryArray,
      tags: matterResult.data.tags || [],
      content: matterResult.content,
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

export function getPostData(slug: string): PostData | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  let dateStr = matterResult.data.date;
  if (dateStr instanceof Date) {
    dateStr = dateStr.toISOString().split('T')[0];
  } else if (typeof dateStr === 'string' && dateStr.includes('T')) {
    dateStr = dateStr.split('T')[0];
  }

    let categoryArray: string[] = [];
    if (matterResult.data.category) {
      if (Array.isArray(matterResult.data.category)) {
        categoryArray = matterResult.data.category;
      } else if (typeof matterResult.data.category === 'string') {
        categoryArray = matterResult.data.category.split(',').map(s => s.trim());
      }
    }

    return {
      slug,
      title: matterResult.data.title || '',
      date: dateStr || '',
      summary: matterResult.data.summary || '',
      category: categoryArray,
      tags: matterResult.data.tags || [],
      content: matterResult.content,
    };
}
