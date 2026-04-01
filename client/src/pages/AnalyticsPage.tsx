import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import TotalsPanel from '../components/TotalsPanel';
import WeeklyChart from '../components/WeeklyChart';
import WeeklyTable from '../components/WeeklyTable';
import { getDailyAnalytics, getProfile, getWeeklyAnalytics, getWorkoutAnalytics } from '../lib/api';
import { addDaysISO, todayISO } from '../lib/date';
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '../types';

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export default function AnalyticsPage() {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const weeklyStart = useMemo(() => addDaysISO(selectedDate, -6), [selectedDate]);

  const dailyQuery = useQuery({
    queryKey: ['daily', selectedDate],
    queryFn: () => getDailyAnalytics(selectedDate)
  });

  const weeklyQuery = useQuery({
    queryKey: ['weekly', weeklyStart],
    queryFn: () => getWeeklyAnalytics(weeklyStart)
  });

  const workoutQuery = useQuery({
    queryKey: ['workoutAnalytics', weeklyStart],
    queryFn: () => getWorkoutAnalytics(weeklyStart)
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  const weeklyAverage = weeklyQuery.data
    ? weeklyQuery.data.days.reduce((sum, day) => sum + day.calories, 0) / weeklyQuery.data.days.length
    : 0;
  const caloriesVsTarget = profileQuery.data
    ? (dailyQuery.data?.totals.calories || 0) - profileQuery.data.profile.dailyCalorieTarget
    : 0;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Nutrition and workout insights"
        subtitle="Review daily nutrition, weekly macro patterns, and training frequency in one analytics page built for a clean browser demo."
      >
        <div className="min-w-[220px]">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Selected date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition duration-200 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Daily calories"
          value={dailyQuery.data ? formatNumber(dailyQuery.data.totals.calories) : '--'}
          hint={profileQuery.data ? `${formatNumber(caloriesVsTarget)} vs target` : 'Waiting for profile target'}
          tone="amber"
        />
        <StatCard
          title="7-day average"
          value={weeklyQuery.data ? formatNumber(weeklyAverage) : '--'}
          hint="Average calories per day"
          tone="sky"
        />
        <StatCard
          title="Workout sessions"
          value={workoutQuery.data ? String(workoutQuery.data.totals.sessions) : '--'}
          hint="Sessions in this 7-day window"
          tone="emerald"
        />
        <StatCard
          title="Completed sets"
          value={workoutQuery.data ? String(workoutQuery.data.totals.sets) : '--'}
          hint="Training volume across tracked workouts"
          tone="violet"
        />
      </div>

      <TotalsPanel
        title={`Daily summary for ${selectedDate}`}
        totals={dailyQuery.data?.totals}
        isLoading={dailyQuery.isLoading}
      />

      {dailyQuery.error ? (
        <SectionCard className="border-rose-100 bg-rose-50/80" title="Unable to load daily analytics">
          <p className="text-sm font-medium text-rose-700">
            {(dailyQuery.error as Error).message}
          </p>
        </SectionCard>
      ) : null}

      <SectionCard title="Daily meal breakdown" subtitle="See how each meal contributes to your totals.">
        {dailyQuery.data ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Meal Type</th>
                  <th className="px-3 py-2">Calories</th>
                  <th className="px-3 py-2">Protein (g)</th>
                  <th className="px-3 py-2">Carbs (g)</th>
                  <th className="px-3 py-2">Fats (g)</th>
                </tr>
              </thead>
              <tbody>
                {MEAL_TYPES.map((mealType) => {
                  const row = dailyQuery.data.breakdown[mealType];
                  return (
                    <tr key={mealType} className="border-t border-slate-100 transition duration-200 hover:bg-slate-50/70">
                      <td className="px-3 py-2 font-medium text-slate-900">{MEAL_TYPE_LABELS[mealType]}</td>
                      <td className="px-3 py-2 text-slate-600">{formatNumber(row.calories)}</td>
                      <td className="px-3 py-2 text-slate-600">{formatNumber(row.protein)}</td>
                      <td className="px-3 py-2 text-slate-600">{formatNumber(row.carbs)}</td>
                      <td className="px-3 py-2 text-slate-600">{formatNumber(row.fats)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No daily data"
            description="Add food items for the selected date to unlock the meal-by-meal macro breakdown."
          />
        )}
      </SectionCard>

      {weeklyQuery.isLoading ? <LoadingState title="Loading weekly analytics" cards={2} /> : null}

      {weeklyQuery.data ? (
        <>
          <SectionCard title="Weekly calorie trend" subtitle={`Window: ${weeklyStart} to ${selectedDate}`}>
            <WeeklyChart days={weeklyQuery.data.days} />
          </SectionCard>
          <WeeklyTable days={weeklyQuery.data.days} />
        </>
      ) : null}

      <SectionCard title="Workout trend" subtitle="Training frequency and set count for the last 7 days.">
        {workoutQuery.isLoading ? (
          <LoadingState title="Loading workout analytics" cards={2} />
        ) : workoutQuery.data ? (
          <div className="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
            <div className="space-y-3">
              {workoutQuery.data.days.map((day) => (
                <div key={day.date} className="rounded-[18px] bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{day.date}</p>
                    <p className="text-sm text-slate-500">{day.sessions} sessions</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-slate-950"
                      style={{
                        width: `${Math.max(
                          (day.sessions /
                            Math.max(...workoutQuery.data.days.map((item) => item.sessions), 1)) *
                            100,
                          day.sessions > 0 ? 12 : 0
                        )}%`
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {day.sets} sets • volume {Math.round(day.volume)}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] bg-sky-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Sessions</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{workoutQuery.data.totals.sessions}</p>
              </div>
              <div className="rounded-[22px] bg-emerald-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Exercises</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{workoutQuery.data.totals.exercises}</p>
              </div>
              <div className="rounded-[22px] bg-amber-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Sets</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{workoutQuery.data.totals.sets}</p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No workout analytics yet"
            description="Log a workout session to show training insights here."
          />
        )}
      </SectionCard>
    </section>
  );
}
