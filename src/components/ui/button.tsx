import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm': variant === 'default',
            'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-sm': variant === 'destructive',
            'border border-primary-300 bg-white hover:bg-primary-50 hover:text-primary-600 text-primary-500': variant === 'outline',
            'bg-secondary-100 text-primary-600 hover:bg-secondary-200 active:bg-secondary-300': variant === 'secondary',
            'hover:bg-primary-50 hover:text-primary-600 text-neutral-700': variant === 'ghost',
            'text-primary-500 underline-offset-4 hover:underline hover:text-primary-600': variant === 'link',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3 text-sm': size === 'sm',
            'h-11 rounded-md px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };