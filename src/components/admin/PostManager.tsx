'use client';

import React, { useState, useEffect } from 'react';
import AdminPanelLayout from './AdminPanelLayout';
import { AdminHeaderBar, AdminTableHeader } from './AdminHeader';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumBadge from '@/components/ui/PremiumBadge';
import MarkdownRenderer from '@/components/MarkdownRenderer';

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
  const [postForm, setPostForm] = useState({
    slug: '',
    originalSlug: '',
    title: '',
    date: '',
    summary: '',
    category: '',
    tags: '',
    content: ''
  });

  const [previewMode, setPreviewMode] = useState(false);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      originalSlug: '',
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
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까?')) return;
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
    showMsg('success', 'AI 블로그 글 작성을 백그라운드에서 시작합니다...');
    try {
      const res = await fetch('/api/admin/generate', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg('success', `🎉 AI 글 작성 성공`);
        fetchData();
      } else {
        showMsg('error', data.error || 'AI 포스팅 중 실패');
      }
    } catch {
      showMsg('error', '서버 통신 실패');
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return (
      <AdminPanelLayout innerClassName="flex items-center justify-center w-full h-full bg-white dark:bg-[#111111]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </AdminPanelLayout>
    );
  }

  const isFormOpen = editingPost || isAddingPost;

  const tableColumns = [
    { label: '날짜', width: 'w-32', align: 'left' as const },
    { label: '포스트 정보', align: 'left' as const },
    { label: '카테고리', width: 'w-32' },
    { label: '관리', width: 'w-32' }
  ];

  return (
    <AdminPanelLayout innerClassName="flex flex-col w-full h-full bg-white dark:bg-[#111111]">
      <AdminHeaderBar 
        title={
          <div className="flex items-center gap-2">
            <span>📝 블로그 포스트 관리</span>
            <span className="text-[10px] md:text-xs text-gray-400 font-medium hidden sm:inline ml-2 font-normal tracking-normal">
              {isFormOpen ? '마크다운 에디터로 포스트를 작성하고 수정합니다.' : '블로그 원고 리스트를 관리합니다.'}
            </span>
          </div>
        }
        action={
          !isFormOpen && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerAiGenerate}
                disabled={aiGenerating}
                className={`flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-none transition-colors shadow-2xl ${aiGenerating ? 'bg-purple-300 dark:bg-purple-900/50 cursor-not-allowed text-white' : 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'}`}
              >
                {aiGenerating ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />생성중...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>AI 포스팅</>
                )}
              </button>
              <button
                onClick={handleOpenAddPost}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-none cursor-pointer transition-colors shadow-2xl flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                새 글 작성
              </button>
            </div>
          )
        }
      />

      <div className="flex-1 min-h-0 flex flex-col w-full">
        {!isFormOpen ? (
          <>
            <div className="hidden md:flex flex-1 min-h-0 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                  <AdminTableHeader columns={tableColumns} />
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800/50">
                    {posts.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-500 font-medium">등록된 포스트가 없습니다.</td></tr>
                    ) : (
                      posts.map(p => (
                        <tr key={p.slug} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">{p.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 dark:text-white text-base">{p.title}</span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-1">{p.summary}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <PremiumBadge color="purple" className="px-2">{p.category || '기타'}</PremiumBadge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleOpenEditPost(p)} className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-none transition-colors" title="수정">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button onClick={() => handleDeletePost(p.slug)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-none transition-colors" title="삭제">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="md:hidden flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50/50 dark:bg-zinc-950/50 custom-scrollbar">
              {posts.map(p => (
                <PremiumCard key={p.slug} borderColor="purple" className="flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <PremiumBadge color="purple">{p.category || '기타'}</PremiumBadge>
                        <span className="text-xs font-mono text-gray-400">{p.date}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{p.title}</h4>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleOpenEditPost(p)} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDeletePost(p.slug)} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{p.summary}</p>
                </PremiumCard>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-zinc-950">
            {/* Top Toolbar */}
            <div className="h-14 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-2xl z-10">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setEditingPost(null); setIsAddingPost(false); }} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-none transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                  {isAddingPost ? '🆕 새 포스트 작성' : '✏️ 포스트 수정'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewMode(!previewMode)} className="md:hidden text-xs font-bold px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded-none">
                  {previewMode ? '에디터 보기' : '미리보기'}
                </button>
                <button onClick={handleSavePost} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xl rounded-none transition-all">
                  저장하기
                </button>
              </div>
            </div>

            {/* Split Editor / Preview */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              {/* Left: Metadata & Editor */}
              <div className={`flex-1 flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto custom-scrollbar ${previewMode ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 space-y-4">
                  <input type="text" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} placeholder="포스트 제목을 입력하세요" className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-700 mb-4" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500">슬러그 (영문)</label>
                      <input type="text" value={postForm.slug} onChange={e => setPostForm({ ...postForm, slug: e.target.value })} className="w-full px-3 py-2 rounded-none border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-xs outline-none" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500">날짜</label>
                      <input type="text" value={postForm.date} onChange={e => setPostForm({ ...postForm, date: e.target.value })} className="w-full px-3 py-2 rounded-none border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-xs font-mono outline-none" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500">카테고리</label>
                      <input type="text" value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })} className="w-full px-3 py-2 rounded-none border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-xs outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500">태그</label>
                      <input type="text" value={postForm.tags} onChange={e => setPostForm({ ...postForm, tags: e.target.value })} className="w-full px-3 py-2 rounded-none border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-xs outline-none" placeholder="쉼표로 구분" />
                    </div>
                  </div>

                  <div className="space-y-1.5 pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <label className="text-[11px] font-bold text-gray-500">요약 (SEO Description)</label>
                    <textarea value={postForm.summary} onChange={e => setPostForm({ ...postForm, summary: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-none border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-xs outline-none resize-none" required />
                  </div>

                  {/* Raw Markdown Area */}
                  <textarea 
                    value={postForm.content} 
                    onChange={e => setPostForm({ ...postForm, content: e.target.value })} 
                    placeholder="여기에 마크다운을 작성하세요..."
                    className="w-full h-96 flex-1 px-2 py-4 text-sm font-mono leading-relaxed bg-transparent border-none outline-none text-gray-800 dark:text-gray-300 resize-none min-h-[500px]"
                    required 
                  />
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 overflow-y-auto custom-scrollbar ${!previewMode ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 md:p-8 w-full max-w-3xl mx-auto">
                  <div className="text-[10px] font-bold text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Live Preview
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight break-words">
                    {postForm.title || '제목 없음'}
                  </h1>
                  <MarkdownRenderer content={postForm.content || '*작성된 내용이 없습니다.*'} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPanelLayout>
  );
}
