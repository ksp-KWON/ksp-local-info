import React from 'react';
import PremiumCard, { type PremiumCardProps } from './PremiumCard';

export interface InkCardProps extends Omit<PremiumCardProps, 'borderColor'> {
  borderColor?: 'charcoal' | 'ink' | 'default';
}

export default function InkCard({
  children,
  borderColor = 'charcoal',
  hoverEffect = true,
  className = '',
  ...props
}: InkCardProps) {
  return (
    <PremiumCard
      borderColor={borderColor}
      hoverEffect={hoverEffect}
      className={className}
      {...props}
    >
      {children}
    </PremiumCard>
  );
}
