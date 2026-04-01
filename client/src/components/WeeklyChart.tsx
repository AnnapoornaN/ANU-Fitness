import EmptyState from './EmptyState';
import { WeeklyDaySummary } from '../types';

type Props = {
  days: WeeklyDaySummary[];
};

function formatDayLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short'
  });
}

export default function WeeklyChart({ days }: Props) {
  const maxCalories = Math.max(...days.map((day) => day.calories), 0);

  if (maxCalories === 0) {
    return (
      <EmptyState
        title="No weekly activity yet"
        description="Add meals through the week to turn this into a clear calorie trend for your demo."
      />
    );
  }

  return (
    <div className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Weekly calorie trend</h3>
          <p className="text-sm text-slate-500">A quick visual summary for your last 7 days.</p>
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          Max {Math.round(maxCalories)} kcal
        </p>
      </div>

      <div className="grid h-64 grid-cols-7 items-end gap-3">
        {days.map((day) => {
          const height = Math.max((day.calories / maxCalories) * 100, day.calories > 0 ? 10 : 0);

          return (
            <div key={day.date} className="flex h-full flex-col items-center justify-end gap-3">
              <span className="text-xs font-semibold text-slate-500">{Math.round(day.calories)}</span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-[18px] bg-gradient-to-t from-sky-500 via-cyan-400 to-emerald-300 shadow-[0_12px_20px_rgba(14,165,233,0.2)] transition duration-200 hover:opacity-90"
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${Math.round(day.calories)} calories`}
                />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xs font-semibold text-slate-700">{formatDayLabel(day.date)}</p>
                <p className="text-[11px] text-slate-400">{day.date.slice(5)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
