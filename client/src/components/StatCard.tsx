import { ReactNode } from 'react';
import { cn } from '../lib/cn';

type Tone = 'sky' | 'emerald' | 'violet' | 'amber';

type Props = {
  title: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: Tone;
  className?: string;
};

const toneStyles: Record<Tone, string> = {
  sky: 'from-sky-500/15 to-cyan-400/10 text-sky-700',
  emerald: 'from-emerald-500/15 to-lime-400/10 text-emerald-700',
  violet: 'from-indigo-500/15 to-sky-400/10 text-indigo-700',
  amber: 'from-amber-400/20 to-orange-300/10 text-amber-700'
};

export default function StatCard({
  title,
  value,
  hint,
  icon,
  tone = 'sky',
  className
}: Props) {
  return (
    <div
      className={cn(
        'rounded-[24px] border border-white/80 bg-gradient-to-br p-5 shadow-[0_14px_32px_rgba(15,23,42,0.06)]',
        toneStyles[tone],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          {hint ? <p className="text-sm text-slate-500">{hint}</p> : null}
        </div>
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-current shadow-sm">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
