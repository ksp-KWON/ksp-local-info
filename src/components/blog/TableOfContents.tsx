import CommonBox from './CommonBox';
import AppIcon from '@/components/ui/AppIcon';

interface TOCItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  toc: TOCItem[];
  activeId: string;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export default function TableOfContents({
  toc,
  activeId,
  onItemClick,
}: TableOfContentsProps) {
  if (!toc.length) return null;

  const headerRight = (
    <span className="text-[11px] font-bold text-zinc-500">클릭 시 이동</span>
  );

  const icon = <AppIcon name="list" size={16} strokeWidth={2.5} className="text-black dark:text-white" />;

  return (
    <CommonBox
      tone="blue"
      title="이 글의 목차"
      icon={icon}
      headerRight={headerRight}
    >
      <ul className="space-y-2 text-xs sm:text-sm">
        {toc.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className="transition-colors">
              <a
                href={`#${item.id}`}
                onClick={(e) => onItemClick(e, item.id)}
                className={`flex items-start gap-2 py-1.5 px-2.5 rounded-none transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-950 dark:bg-sky-950/60 dark:text-sky-200 font-bold border border-sky-300 dark:border-sky-800'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white font-medium'
                }`}
              >
                <span className={`text-xs ${isActive ? 'font-bold text-sky-700 dark:text-sky-400' : 'text-zinc-400 font-medium'}`}>
                  0{idx + 1}.
                </span>
                <span className="break-keep flex-1 leading-snug">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </CommonBox>
  );
}
