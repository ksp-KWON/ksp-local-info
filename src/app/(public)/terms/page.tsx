import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 의정부 건강·생활 정보 포털',
  description: '의정부 건강·생활 정보 포털의 서비스 이용약관입니다.',
  alternates: {
    canonical: 'https://ksp-local-info.vercel.app/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-[#202124] rounded-none p-6 sm:p-12 border border-gray-100 dark:border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#e8eaed] mb-8 pb-4 border-b border-gray-100 dark:border-white/5">
        서비스 이용약관
      </h1>
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-[#5f6368] dark:text-[#9aa0a6] space-y-6">
        <p>
          환영합니다! 본 약관은 &quot;의정부 건강·생활 정보 포털&quot;(이하 &quot;사이트&quot;)이 제공하는 서비스의 이용과 관련하여, 사이트와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
        </p>

        <section>
          <h3 className="font-bold text-[#202124] dark:text-[#e8eaed] mt-6 mb-2">제1조 (목적 및 서비스의 성격)</h3>
          <p>
            1. 본 사이트는 의정부시의 공공서비스, 혜택, 행사, 의료 정보 등을 시민들이 쉽게 확인할 수 있도록 큐레이션하여 제공하는 정보 제공 채널입니다.<br />
            2. 본 사이트는 의정부시청 등 <strong>공공기관이 공식적으로 운영하는 사이트가 아니며</strong>, 독립적으로 운영되는 비영리/정보제공 목적의 포털입니다.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[#202124] dark:text-[#e8eaed] mt-6 mb-2">제2조 (정보의 무결성 및 면책 조항)</h3>
          <p>
            1. 사이트에서 제공하는 모든 정보 및 데이터(지원금 대상, 행사 일정, 병원 정보 등)는 공식 출처를 기반으로 작성되었으나, 시간의 경과나 정책의 변경 등에 따라 실제와 다를 수 있습니다.<br />
            2. 사이트는 제공된 정보의 100% 정확성, 최신성, 완전성을 보증하지 않으며, 해당 정보를 바탕으로 한 이용자의 어떠한 결정이나 손해에 대해서도 <strong>법적 책임을 지지 않습니다.</strong><br />
            3. 최종적이고 정확한 확인이 필요한 경우, 반드시 해당 정보의 원출처(의정부시청, 해당 병원 등)에 직접 문의하시기 바랍니다.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[#202124] dark:text-[#e8eaed] mt-6 mb-2">제3조 (저작권 및 지적재산권)</h3>
          <p>
            1. 사이트에서 직접 작성하고 편집한 칼럼, 텍스트, 디자인 등 모든 콘텐츠의 저작권은 본 사이트에 있습니다.<br />
            2. 이용자는 사이트의 정보를 영리 목적으로 무단 복제, 전송, 배포할 수 없습니다. (단, 출처를 명시한 비영리적 목적의 단순 공유는 허용됩니다.)
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[#202124] dark:text-[#e8eaed] mt-6 mb-2">제4조 (서비스의 변경 및 중단)</h3>
          <p>
            1. 사이트는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.<br />
            2. 무료로 제공되는 서비스의 특성상, 서비스 중단으로 인해 발생한 이용자의 불편이나 손해에 대해 별도의 보상을 하지 않습니다.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-[#202124] dark:text-[#e8eaed] mt-6 mb-2">제5조 (기타)</h3>
          <p>
            본 약관에 명시되지 않은 사항은 관계 법령 및 상관례에 따릅니다.
          </p>
        </section>

        <div className="mt-12 text-sm text-[#5f6368] dark:text-[#9aa0a6] border-t border-gray-100 dark:border-white/5 pt-6">
          본 이용약관은 사이트 개설일부터 적용됩니다.
        </div>
      </div>
    </div>
  );
}
