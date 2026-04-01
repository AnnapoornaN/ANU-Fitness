import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(function TextAreaField(
  { label, error, hint, className, wrapperClassName, id, rows = 4, ...props },
  ref
) {
  return (
    <label className={cn('block space-y-2', wrapperClassName)} htmlFor={id}>
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 ease-in-out placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100',
          error && 'border-rose-300 focus:border-rose-300 focus:ring-rose-100',
          className
        )}
        {...props}
      />
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </label>
  );
});

export default TextAreaField;
