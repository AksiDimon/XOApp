import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/classNames';

type Props = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: Props) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 text-slate-100',
        'shadow-[0_25px_80px_-48px_rgba(0,0,0,0.95)] backdrop-blur-2xl',
        className
      )}
    />
  );
}
