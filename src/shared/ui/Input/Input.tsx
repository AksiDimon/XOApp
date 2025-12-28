import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/classNames';

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-100',
        'bg-white/5 backdrop-blur-sm shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]',
        'transition duration-200 placeholder:text-slate-500',
        'focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none',
        'hover:border-white/25',
        className
      )}
    />
  );
}
