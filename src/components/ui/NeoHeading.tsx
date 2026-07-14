import React from 'react';

type Color = 'blue' | 'pink' | 'yellow' | 'green' | 'red' | 'default';

interface NeoHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  highlighterColor?: Color;
  icon?: React.ReactNode;
}

export default function NeoHeading({
  children,
  className = '',
  level = 2,
  highlighterColor = 'default',
  icon,
  ...props
}: NeoHeadingProps) {
  const Tag = `h${level}` as React.ElementType;
  
  // Base classes for the heading (font, color, etc.)
  let baseClass = 'font-dohyeon font-normal tracking-wide text-black dark:text-white flex items-center gap-2 mb-3';
  
  // Adjust size based on heading level
  if (level === 1) baseClass += ' text-2xl sm:text-3xl';
  else if (level === 2) baseClass += ' text-xl sm:text-2xl';
  else if (level === 3) baseClass += ' text-lg sm:text-xl';
  else baseClass += ' text-base sm:text-lg';

  const highlighterClass = highlighterColor !== 'default' ? `highlighter-${highlighterColor} px-1` : '';

  return (
    <Tag className={`${baseClass} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span className={highlighterClass}>{children}</span>
    </Tag>
  );
}
