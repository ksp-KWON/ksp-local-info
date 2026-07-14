import React from 'react';

type ShadowColor = 'blue' | 'pink' | 'yellow' | 'green' | 'red' | 'default';

interface NeoBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  shadowColor?: ShadowColor;
  hoverEffect?: boolean;
}

export default function NeoBox({
  children,
  className = '',
  shadowColor = 'default',
  hoverEffect = false,
  ...props
}: NeoBoxProps) {
  // Determine shadow class based on color
  const shadowClass = shadowColor === 'default' 
    ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
    : `shadow-marker-${shadowColor}`;

  // Determine hover classes
  const hoverClass = hoverEffect 
    ? `hover:-translate-y-1 hover:-translate-x-1 hover:${shadowClass} transition-all duration-200 group`
    : 'transition-all duration-300';

  return (
    <div 
      className={`bg-white dark:bg-[#121417] p-5 sm:p-6 border-2 border-black dark:border-white ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
