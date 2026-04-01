import { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Option = {
  label: string;
  value: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
  options: Option[];
};

export default function SelectField({
  label,
  error,
  hint,
  className,
  wrapperClassName,
  id,
  options,
  ...props
}: Props) {
  return (
    <label className={cn('block space-y-2', wrapperClassName)} htmlFor={id}>
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <select
        id={id}
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 ease-in-out focus:border-sky-300 focus:ring-4 focus:ring-sky-100',
          error && 'border-rose-300 focus:border-rose-300 focus:ring-rose-100',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </label>
  );
}
