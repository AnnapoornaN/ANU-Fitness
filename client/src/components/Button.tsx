import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleOptions & {
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
  };

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-sky-600 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-500 focus-visible:ring-sky-200',
  secondary:
    'bg-emerald-50 text-emerald-900 shadow-sm hover:bg-emerald-100 focus-visible:ring-emerald-200',
  outline:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-200',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-200',
  danger:
    'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400 focus-visible:ring-rose-200'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base'
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  block = false
}: ButtonStyleOptions = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-60',
    variantStyles[variant],
    sizeStyles[size],
    block && 'w-full'
  );
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  block = false,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: Props) {
  return (
    <button className={cn(buttonStyles({ variant, size, block }), className)} {...props}>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  );
}
