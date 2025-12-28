import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/classNames';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-2xl font-semibold',
        'transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70',
        size === 'sm' ? 'h-9 px-4 text-sm' : 'h-11 px-5 text-sm',
        variant === 'primary' &&
          'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-[0_20px_70px_-30px_rgba(59,130,246,0.95)] hover:scale-[1.01] hover:shadow-[0_24px_80px_-32px_rgba(59,130,246,0.95)] active:scale-[0.99]',
        variant === 'secondary' &&
          'border border-white/15 bg-white/5 text-slate-100 hover:border-cyan-400/40 hover:bg-white/10 active:scale-[0.99]',
        variant === 'ghost' &&
          'text-slate-200 hover:bg-white/5 hover:text-white active:scale-[0.99]',
        className
      )}
    />
  );
}
