import { ReactNode } from 'react';
import Badge from './Badge';
import SectionCard from './SectionCard';

type Props = {
  title: string;
  count: number;
  children: ReactNode;
};

export default function MealCard({ title, count, children }: Props) {
  return (
    <SectionCard
      title={title}
      subtitle={count > 0 ? `${count} item${count === 1 ? '' : 's'} logged` : 'No food logged yet'}
      actions={<Badge tone={count > 0 ? 'emerald' : 'slate'}>{count} items</Badge>}
      className="h-full"
    >
      {children}
    </SectionCard>
  );
}
