import { WeeklyDaySummary } from '../types';

type Props = {
  days: WeeklyDaySummary[];
};

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export default function WeeklyTable({ days }: Props) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-slate-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Calories</th>
            <th className="px-4 py-3 font-semibold">Protein (g)</th>
            <th className="px-4 py-3 font-semibold">Carbs (g)</th>
            <th className="px-4 py-3 font-semibold">Fats (g)</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date} className="border-t border-slate-100 transition duration-200 hover:bg-slate-50/70">
              <td className="px-4 py-3 font-medium text-slate-900">{day.date}</td>
              <td className="px-4 py-3 text-slate-600">{formatNumber(day.calories)}</td>
              <td className="px-4 py-3 text-slate-600">{formatNumber(day.protein)}</td>
              <td className="px-4 py-3 text-slate-600">{formatNumber(day.carbs)}</td>
              <td className="px-4 py-3 text-slate-600">{formatNumber(day.fats)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
