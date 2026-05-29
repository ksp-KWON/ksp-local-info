'use client';

import React, { useState } from 'react';

export default function GovTuitionSupport() {
  const [activeTab, setActiveTab] = useState<'dest' | 'content' | 'apply' | 'info'>('dest');

  return (
    <div className="my-8 border border-slate-200 rounded-3xl overflow-hidden shadow-sm bg-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 md:p-8 flex items-center gap-4 md:gap-6">
        <div className="text-4xl md:text-5xl bg-white/10 p-3 rounded-full flex items-center justify-center w-14 h-14 md:w-16 md:h-16 shrink-0">
          👶
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white m-0 leading-tight">
            유아학비 (누리과정) 지원제도
          </h2>
          <p className="text-sm md:text-base text-blue-100 m-0 mt-1 font-medium">
            유치원에 다니는 만 3~5세 아동의 학비 부담을 완전히 덜어드립니다!
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('dest')}
          className={`flex-1 min-w-[100px] py-4 text-center font-bold text-sm md:text-base border-b-3 transition-all cursor-pointer ${
            activeTab === 'dest'
              ? 'text-blue-900 border-blue-900 bg-white'
              : 'text-slate-500 border-transparent hover:text-blue-900 hover:bg-slate-100'
          }`}
        >
          🎯 지원대상
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 min-w-[100px] py-4 text-center font-bold text-sm md:text-base border-b-3 transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'text-blue-900 border-blue-900 bg-white'
              : 'text-slate-500 border-transparent hover:text-blue-900 hover:bg-slate-100'
          }`}
        >
          🎁 지원내용
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex-1 min-w-[100px] py-4 text-center font-bold text-sm md:text-base border-b-3 transition-all cursor-pointer ${
            activeTab === 'apply'
              ? 'text-blue-900 border-blue-900 bg-white'
              : 'text-slate-500 border-transparent hover:text-blue-900 hover:bg-slate-100'
          }`}
        >
          📅 신청방법
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 min-w-[100px] py-4 text-center font-bold text-sm md:text-base border-b-3 transition-all cursor-pointer ${
            activeTab === 'info'
              ? 'text-blue-900 border-blue-900 bg-white'
              : 'text-slate-500 border-transparent hover:text-blue-900 hover:bg-slate-100'
          }`}
        >
          💡 상세정보
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 md:p-8">
        
        {/* Tab 1: 지원대상 */}
        {activeTab === 'dest' && (
          <div className="animate-fadeIn">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-5 border-l-4 border-blue-600 pl-3">
              누가 지원을 받을 수 있나요?
            </h3>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
              <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span>🔍</span> 기본 대상 조건
              </div>
              <ul className="space-y-3 pl-1">
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  소득 수준과 무관하게 <strong>누구나 지원 가능</strong>합니다.
                </li>
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  국·공립 및 사립 유치원에 재원 중인 <strong>만 3세 ~ 만 5세</strong>의 대한민국 국적 아동이 대상입니다.
                </li>
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  초등학교 취학을 유예하여 유치원에 재학 중인 유아도 <strong>유예 기간인 1년에 한하여 추가 지원</strong> 혜택을 제공합니다.
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-2xl text-amber-900 text-sm md:text-base leading-relaxed">
              ⚠️ <strong>제외 대상 안내</strong>: 어린이집 보육료나 가정 양육수당 등 다른 유사 정부 혜택을 동시에 중복으로 수령할 수 없습니다.
            </div>
          </div>
        )}

        {/* Tab 2: 지원내용 */}
        {activeTab === 'content' && (
          <div className="animate-fadeIn">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-5 border-l-4 border-blue-600 pl-3">
              매달 얼마를 어떻게 지원하나요?
            </h3>
            <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed">
              아동이 다니는 유치원의 성격에 따라 지원 금액이 구분되어 지급됩니다.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-slate-200 text-center text-sm md:text-base">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 p-3 font-bold text-slate-700">구분</th>
                    <th className="border border-slate-200 p-3 font-bold text-slate-700">국·공립 유치원</th>
                    <th className="border border-slate-200 p-3 font-bold text-slate-700">사립 유치원</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 p-3 font-bold text-slate-700">교육과정비</td>
                    <td className="border border-slate-200 p-3 text-slate-600">월 100,000원</td>
                    <td className="border border-slate-200 p-3 text-slate-600">월 280,000원</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-3 font-bold text-slate-700">방과후 과정비</td>
                    <td className="border border-slate-200 p-3 text-slate-600">월 50,000원 (해당자)</td>
                    <td className="border border-slate-200 p-3 text-slate-600">월 70,000원 (해당자)</td>
                  </tr>
                  <tr className="bg-blue-50/30">
                    <td className="border border-slate-200 p-3 font-bold text-slate-700">합계 (최대)</td>
                    <td className="border border-slate-200 p-3">
                      <span className="inline-block px-3 py-1 text-xs md:text-sm font-bold bg-blue-100 text-blue-800 rounded-full">
                        월 15만 원
                      </span>
                    </td>
                    <td className="border border-slate-200 p-3">
                      <span className="inline-block px-3 py-1 text-xs md:text-sm font-bold bg-orange-100 text-orange-800 rounded-full">
                        월 35만 원
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mt-6">
              <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span>💡</span> 저소득층 자녀 특별 추가 혜택
              </div>
              <ul className="space-y-3 pl-1">
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>대상</strong>: 사립유치원에 재원 중인 법정 저소득층(기초생활수급자, 차상위계층, 한부모가정) 유아
                </li>
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>내용</strong>: 관할 교육청이나 지자체 심사를 통해 일반 사립유치원 지원비 외에 추가 특별 학비 혜택을 받으실 수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: 신청방법 */}
        {activeTab === 'apply' && (
          <div className="animate-fadeIn">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-5 border-l-4 border-blue-600 pl-3">
              어떻게 편리하게 신청하나요?
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-5">
              <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span>💻</span> 1. 온라인 신청 (복지로)
              </div>
              <ul className="space-y-2 pl-1">
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>신청 주소</strong>: <a href="https://www.bokjiro.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">복지로 공식 누리집</a>에 접속합니다.
                </li>
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>신청 경로</strong>: 로그인 후 <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">서비스 신청</code> → <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">복지서비스 신청</code> → <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">영유아</code> 코너에서 <strong>'유아학비(유치원)'</strong>를 선택합니다.
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-5">
              <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span>👣</span> 2. 오프라인 신청 (주민센터)
              </div>
              <ul className="space-y-2 pl-1">
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>신청 방법</strong>: 아동의 주민등록지 기준 관할 <strong>읍·면·동 주민센터(행정복지센터)</strong>에 신분증을 소지하고 직접 방문 신청합니다.
                </li>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl text-red-950 text-sm md:text-base leading-relaxed">
              🚨 <strong>매우 중요</strong>: 입학 전에 반드시 <strong>'유아학비'로 서비스 전환(변경) 신청</strong>을 완료해야 합니다. 소급 지원이 절대 되지 않으므로 서둘러 신청하세요!
            </div>
          </div>
        )}

        {/* Tab 4: 상세정보 */}
        {activeTab === 'info' && (
          <div className="animate-fadeIn">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-5 border-l-4 border-blue-600 pl-3">
              궁금한 점은 어디로 문의하나요?
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-5">
              <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span>📞</span> 주요 연락망 정보
              </div>
              <ul className="space-y-2 pl-1">
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>교육부 에듀콜 상담센터</strong>: ☎️ 1544-0079
                </li>
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>보건복지부 콜센터</strong>: ☎️ 129
                </li>
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>국가평생교육진흥원 유아학비콜센터</strong>: ☎️ 1544-0079
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <span>📋</span> 신청 서류 및 필수 발급
              </div>
              <ul className="space-y-2 pl-1">
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>필수 카드</strong>: 학부모 명의의 <strong>'국민행복카드(아이행복카드)'</strong>를 통해 학비가 자동 정산 및 지원되므로 사전 발급이 필수적입니다.
                </li>
                <li className="relative pl-5 text-sm md:text-base text-slate-600 leading-relaxed before:content-['•'] before:text-blue-600 before:font-bold before:absolute before:left-1 before:top-0">
                  <strong>제출 서류</strong>: 주민센터 직접 방문 시 신청인의 신분증이 필요하며, 대리인 신청 시 위임장 및 관계 증명 서류가 요구됩니다.
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
