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
                    ? 'bg-black text-white dark:bg-white dark:text-black font-black border border-black dark:border-white'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white font-medium'
                }`}
              >
                <span className={`text-xs ${isActive ? 'font-black' : 'text-zinc-400 font-bold'}`}>
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
