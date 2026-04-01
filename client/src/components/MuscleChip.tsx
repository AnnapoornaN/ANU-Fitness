import { buttonStyles } from './Button';
import { cn } from '../lib/cn';

type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function MuscleChip({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        buttonStyles({ variant: selected ? 'primary' : 'outline', size: 'sm' }),
        'justify-between rounded-full px-4',
        !selected && 'bg-white/70'
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'h-2.5 w-2.5 rounded-full transition duration-200',
          selected ? 'bg-white' : 'bg-slate-300'
        )}
      />
    </button>
  );
}
