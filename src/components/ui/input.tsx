import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
