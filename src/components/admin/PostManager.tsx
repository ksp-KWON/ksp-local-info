'use client';

import React, { useState, useEffect } from 'react';

interface PostItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
  tags?: string[];
  content: string;
}

export default function PostManager({ showMsg }: { showMsg: (type: 'success' | 'error', text: string) => void }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);

  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [postForm, setPostForm] = useState<{
    slug: string;
    originalSlug?: string;
    title: string;
    date: string;
    summary: string;
    category: string;
    tags: string;
    content: string;
  }>({
    slug: '',
    title: '',
    date: '',
    summary: '',
    category: '',
    tags: '',
    content: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data || []);
      }
    } catch {
      showMsg('error', '포스트 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEditPost = async (post: PostItem) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts?slug=${post.slug}`);
      if (res.ok) {
        const fullPost: PostItem = await res.json();
        setEditingPost(fullPost);
        setIsAddingPost(false);
        setPostForm({
          slug: fullPost.slug,
          originalSlug: fullPost.slug,
          title: fullPost.title,
          date: fullPost.date,
          summary: fullPost.summary,
          category: fullPost.category || '기타',
          tags: (fullPost.tags || []).join(', '),
          content: fullPost.content
        });
      }
    } catch {
      showMsg('error', '상세 내용을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddPost = () => {
    setEditingPost(null);
    setIsAddingPost(true);
    setPostForm({
      slug: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      category: '일반',
      tags: '',
      content: ''
    });
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isAddingPost ? 'POST' : 'PUT';
      const payload = {
        ...postForm,
        tags: postForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      const res = await fetch('/api/admin/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg('success', '포스트가 저장되었습니다.');
        fetchData();
        setEditingPost(null);
        setIsAddingPost(false);
      } else {
        showMsg('error', data.error || '저장 실패');
      }
    } catch {
      showMsg('error', '서버 통신 오류');
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까? (실제 .md 파일이 삭제됩니다)')) return;
    try {
      const res = await fetch(`/api/admin/posts?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('success', '포스트가 삭제되었습니다.');
        fetchData();
      } else {
        showMsg('error', '삭제 실패');
      }
    } catch {
      showMsg('error', '통신 오류');
    }
  };

  const handleTriggerAiGenerate = async () => {
    setAiGenerating(true);
    showMsg('success', 'Gemini AI 블로그 글 작성을 백그라운드에서 시작합니다...');
    try {
      const res = await fetch('/api/admin/generate', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg('success', `🎉 AI 글 작성 성공: ${data.output || '새 글이 발행되었습니다.'}`);
        fetchData();
      } else {
        showMsg('error', data.error || 'AI 포스팅 중 실패 또는 이미 같은 글이 존재합니다.');
      }
    } catch {
      showMsg('error', '서버 백그라운드 AI 스크립트 가동 실패');
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">데이터를 불러오는 중...</div>;
  }

  return (
    <div>
      {!editingPost && !isAddingPost ? (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              📝 블로그 포스트 관리
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerAiGenerate}
                disabled={aiGenerating}
                className={`flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 rounded-lg transition-colors shadow-sm ${aiGenerating ? 'bg-purple-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer'}`}
              >
                {aiGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI 생성중...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    AI 자동 포스팅 실행
                  </>
                )}
              </button>
              <button
                onClick={handleOpenAddPost}
                className="bg-slate-800 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer transition-colors"
              >
                + 새 글 작성
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="p-4 w-[100px]">날짜</th>
                  <th className="p-4">제목</th>
                  <th className="p-4">요약</th>
                  <th className="p-4 w-[120px] text-center">동작</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {posts.map(p => (
                  <tr key={p.slug} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300">
                    <td className="p-4 font-mono">{p.date}</td>
                    <td className="p-4 font-bold">{p.title}</td>
                    <td className="p-4"><p className="line-clamp-2">{p.summary}</p></td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditPost(p)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-1 px-2 rounded cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeletePost(p.slug)}
                          className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-1 px-2 rounded cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {isAddingPost ? '📝 새 블로그 글 작성' : '✏️ 블로그 글 수정'}
          </h3>
          <form onSubmit={handleSavePost} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">파일 슬러그 (영문, 예: my-post)</label>
                <input
                  type="text"
                  value={postForm.slug}
                  onChange={e => setPostForm({ ...postForm, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">제목 (Title)</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">날짜 (YYYY-MM-DD)</label>
                <input
                  type="text"
                  value={postForm.date}
                  onChange={e => setPostForm({ ...postForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">카테고리</label>
                <input
                  type="text"
                  value={postForm.category}
                  onChange={e => setPostForm({ ...postForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">요약 (SEO Description)</label>
              <textarea
                value={postForm.summary}
                onChange={e => setPostForm({ ...postForm, summary: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">태그 (쉼표로 구분)</label>
              <input
                type="text"
                value={postForm.tags}
                onChange={e => setPostForm({ ...postForm, tags: e.target.value })}
                placeholder="지원금, 행사, 청년"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">본문 (Markdown 형식)</label>
              <textarea
                value={postForm.content}
                onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 font-mono leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setIsAddingPost(false);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
