import { ReactNode } from 'react';
import { cn } from '../lib/cn';

type Props = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className,
  contentClassName
}: Props) {
  return (
    <section
      className={cn(
        'rounded-[24px] border border-white/70 bg-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.07)] backdrop-blur',
        className
      )}
    >
      {title || subtitle || actions ? (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : null}
            {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn('p-5', contentClassName)}>{children}</div>
    </section>
  );
}
