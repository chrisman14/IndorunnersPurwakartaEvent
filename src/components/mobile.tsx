'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileCard({ children, className, onClick }: MobileCardProps) {
  return (
    <Card 
      className={cn(
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.98] touch-manipulation',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

interface MobileGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

export function MobileGrid({ children, cols = 1, className }: MobileGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={cn('grid gap-4 sm:gap-6', gridCols[cols], className)}>
      {children}
    </div>
  );
}

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <div className={cn('px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}