import { ReactNode } from 'react';
import { cn } from '../lib/cn';

type BadgeTone = 'slate' | 'sky' | 'emerald' | 'amber' | 'rose';

type Props = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const toneStyles: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200'
};

export default function Badge({ children, tone = 'slate', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
