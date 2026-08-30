import type { Metadata } from 'next';
import Link from 'next/link';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumHeading from '@/components/ui/PremiumHeading';
import AppIcon from '@/components/ui/AppIcon';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 의정부 건강·생활 정보 포털',
  description: '의정부 건강·생활 정보 포털의 이용자 개인정보 보호 및 처리 방침입니다.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8 sm:py-12 space-y-6">
      {/* 브레드크럼 */}
      <nav className="flex text-xs text-zinc-500 dark:text-zinc-400" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1.5 font-medium">
          <li>
            <Link href="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1">
              <AppIcon name="home" size={13} strokeWidth={2} />
              홈
            </Link>
          </li>
          <li>
            <span className="mx-1 text-zinc-400">/</span>
          </li>
          <li className="text-zinc-900 dark:text-white font-bold" aria-current="page">
            개인정보처리방침
          </li>
        </ol>
      </nav>

      <PremiumCard hoverEffect={false} className="p-6 sm:p-10">
        <PremiumHeading level={1} showLeftBorder={false} className="!mb-6 !pb-4 border-b border-gray-100 dark:border-zinc-800">
          개인정보처리방침
        </PremiumHeading>
        <div className="text-sm sm:text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-6 font-normal">
          <p>
            &quot;의정부 건강·생활 정보 포털&quot;(이하 &quot;사이트&quot;)은 이용자의 개인정보를 소중히 다루며, 「개인정보 보호법」 등 관련 법규를 철저히 준수합니다.
          </p>
          <p>
            본 사이트는 별도의 회원가입 없이 모든 공공데이터 혜택 및 지도 정보를 자유롭게 열람할 수 있으며, <strong>이용자를 식별할 수 있는 민감한 개인정보를 일절 수집하거나 저장하지 않습니다.</strong>
          </p>

          <section className="space-y-2">
            <PremiumHeading level={3} showLeftBorder={false} className="!mt-4 !mb-2">
              1. 수집하는 로그 항목 및 방법
            </PremiumHeading>
            <p>
              - <strong>자동 수집 항목 : </strong>웹사이트 접속 시 통계 분석 및 보안을 위해 접속 IP, 쿠키(Cookie), 브라우저 종류, 방문 일시 등의 비식별 로그가 자동으로 수집될 수 있습니다.<br />
              - <strong>수집 방법 : </strong>웹 브라우저의 기본 요청 헤더 및 분석 도구를 통한 자동 수집
            </p>
          </section>

          <section className="space-y-2">
            <PremiumHeading level={3} showLeftBorder={false} className="!mt-4 !mb-2">
              2. 개인정보의 이용 목적
            </PremiumHeading>
            <p>
              수집된 비식별 통계 정보는 사이트 접속 트래픽 분석, 사용자 환경 최적화, 신규 생활 공공서비스 콘텐츠 발굴을 위한 기초 통계 목적으로만 활용됩니다.
            </p>
          </section>

          <section className="space-y-2">
            <PremiumHeading level={3} showLeftBorder={false} className="!mt-4 !mb-2">
              3. 제3자 제공 및 위탁
            </PremiumHeading>
            <p>
              사이트는 이용자의 개인정보를 외부에 판매하거나 제공하지 않습니다. 다만, 법령에 따른 공식 수사기관의 적법한 요청이 있는 경우에는 예외로 합니다.
            </p>
          </section>

          <section className="space-y-2">
            <PremiumHeading level={3} showLeftBorder={false} className="!mt-4 !mb-2">
              4. 쿠키(Cookie) 운용 및 거부 방법
            </PremiumHeading>
            <p>
              이용자는 웹 브라우저 설정을 통해 쿠키 허용 여부를 언제든지 직접 제어할 수 있습니다. 쿠키 저장을 거부하더라도 사이트의 모든 공공서비스 및 글 열람에 어떠한 제약도 없습니다.
            </p>
          </section>

          <div className="mt-8 text-xs text-zinc-400 dark:text-zinc-500 border-t border-gray-100 dark:border-zinc-800 pt-4">
            본 개인정보처리방침은 사이트 개설일부터 적용됩니다.
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}
