import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관 | 의정부 건강·생활 정보 포털',
  description: '의정부 건강·생활 정보 포털 서비스 이용에 관한 권리와 의무, 면책 조항을 규정합니다.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8 sm:py-12 space-y-6">
      {/* 브레드크럼 */}
      <nav className="flex text-xs text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1.5">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              홈
            </Link>
          </li>
          <li>
            <span className="mx-1">/</span>
          </li>
          <li className="text-gray-900 dark:text-white font-bold" aria-current="page">
            이용약관
          </li>
        </ol>
      </nav>

      <div className="bg-white dark:bg-[#181a1d] rounded-none p-6 sm:p-10 border border-gray-200/80 dark:border-zinc-800 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
          서비스 이용약관
        </h1>
        <div className="text-sm sm:text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 space-y-6 font-medium">
          <p>
            환영합니다! 본 약관은 &quot;의정부 건강·생활 정보 포털&quot;(이하 &quot;사이트&quot;)이 제공하는 공공데이터 기반 정보 서비스의 이용과 관련하여, 사이트와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              제1조 (목적 및 서비스의 성격)
            </h2>
            <p>
              1. 본 사이트는 의정부시의 공공서비스, 혜택, 행사, 심야/휴일 의료 정보 등을 시민들이 쉽게 확인할 수 있도록 큐레이션하여 제공하는 비영리 공공데이터 정보 채널입니다.<br />
              2. 본 사이트는 의정부시청 등 공공기관이 직접 운영하는 공식 사이트가 아니며, 정부 공공데이터를 기반으로 독립적으로 서비스되는 포털입니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              제2조 (정보의 정확성 및 면책 조항)
            </h2>
            <p>
              1. 사이트에서 제공하는 모든 정보는 공식 공공데이터 API 및 고시 자료를 기반으로 작성되었으나, 행정 지침 변경이나 예산 소진 상황 등에 따라 실제와 다를 수 있습니다.<br />
              2. 사이트는 제공된 정보의 무결성이나 적시성을 보증하기 위해 최선을 다하나, 해당 정보를 바탕으로 한 이용자의 신청 결과 등에 대해 법적 책임을 지지 않습니다.<br />
              3. 정확한 확인이 필요한 경우, 각 본문에 첨부된 공식 소관 기관 링크를 통해 최종 공고를 직접 확인하시기 바랍니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              제3조 (저작권 및 지적재산권)
            </h2>
            <p>
              1. 사이트에서 직접 작성하고 편집한 칼럼, 텍스트, 디자인 등 모든 콘텐츠의 저작권은 본 사이트에 있습니다.<br />
              2. 이용자는 사이트의 정보를 영리 목적으로 무단 복제, 전송, 배포할 수 없습니다. (단, 출처를 명시한 비영리적 목적의 단순 공유는 허용됩니다.)
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              제4조 (서비스의 변경 및 중단)
            </h2>
            <p>
              1. 사이트는 공공데이터 API 점검이나 시스템 개선 필요에 따라 서비스의 전부 또는 일부를 변경할 수 있습니다.<br />
              2. 무료로 제공되는 서비스의 특성상, 일시적인 서비스 점검으로 인한 불편에 대해 별도의 보상을 하지 않습니다.
            </p>
          </section>

          <div className="mt-8 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-zinc-800 pt-4">
            본 이용약관은 사이트 개설일부터 적용됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
