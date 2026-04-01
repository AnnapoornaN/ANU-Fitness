import SectionCard from './SectionCard';
import StatCard from './StatCard';
import { Totals } from '../types';

type Props = {
  title: string;
  totals?: Totals;
  isLoading?: boolean;
};

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export default function TotalsPanel({ title, totals, isLoading }: Props) {
  if (isLoading) {
    return (
      <SectionCard title={title} subtitle="Crunching your nutrition totals">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[24px] bg-slate-100" />
          ))}
        </div>
      </SectionCard>
    );
  }

  if (!totals) {
    return (
      <SectionCard title={title} subtitle="No totals available yet">
        <p className="text-sm text-slate-500">Add meals to generate calories and macro totals.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={title} subtitle="Your nutrition snapshot at a glance">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Calories" value={formatNumber(totals.calories)} hint="Total energy" tone="amber" />
        <StatCard title="Protein" value={formatNumber(totals.protein)} hint="Recovery support" tone="emerald" />
        <StatCard title="Carbs" value={formatNumber(totals.carbs)} hint="Training fuel" tone="sky" />
        <StatCard title="Fats" value={formatNumber(totals.fats)} hint="Daily balance" tone="violet" />
      </div>
    </SectionCard>
  );
}
