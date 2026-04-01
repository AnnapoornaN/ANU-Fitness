import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { buttonStyles } from '../components/Button';
import { getDashboard } from '../lib/api';
import { FITNESS_GOAL_LABELS, MEAL_TYPE_LABELS } from '../types';

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function formatVolume(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return Math.round(value).toString();
}

export default function HomePage() {
  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard()
  });

  if (dashboardQuery.isLoading) {
    return <LoadingState title="Loading your dashboard" cards={6} />;
  }

  if (dashboardQuery.error) {
    return (
      <SectionCard className="border-rose-100 bg-rose-50/80" title="Unable to load dashboard">
        <p className="text-sm font-medium text-rose-700">
          {(dashboardQuery.error as Error).message}
        </p>
      </SectionCard>
    );
  }

  const dashboard = dashboardQuery.data!;
  const weeklyCalorieMax = Math.max(...dashboard.weeklyCalories.map((day) => day.calories), 1);
  const weeklyWorkoutMax = Math.max(...dashboard.weeklyWorkouts.map((day) => day.sessions), 1);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome to Anu&apos;s Fitness"
        subtitle="A polished browser-based fitness dashboard for planning workouts, tracking meals, logging sessions, and reviewing progress in one presentation-ready flow."
      >
        <div className="rounded-[24px] border border-sky-100 bg-sky-50/80 px-4 py-4 text-sm text-sky-900 shadow-sm">
          <p className="font-semibold">{dashboard.user.displayName || dashboard.user.username}</p>
          <p className="mt-1 text-sky-700">
            Goal: {FITNESS_GOAL_LABELS[dashboard.user.fitnessGoal]} • {dashboard.date}
          </p>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Calories today"
          value={formatNumber(dashboard.overview.caloriesLogged)}
          hint={`${formatNumber(dashboard.overview.remainingCalories)} remaining from target`}
          tone="amber"
        />
        <StatCard
          title="Meals logged"
          value={String(dashboard.overview.mealsLogged)}
          hint="Across all meal sections"
          tone="sky"
        />
        <StatCard
          title="Workout streak"
          value={`${dashboard.overview.workoutStreak} day`}
          hint={`${dashboard.overview.workoutsThisWeek} sessions in the last week`}
          tone="emerald"
        />
        <StatCard
          title="Exercise library"
          value={String(dashboard.overview.exerciseLibraryCount)}
          hint={`${dashboard.overview.completedSetsThisWeek} sets completed this week`}
          tone="violet"
        />
      </div>

      <SectionCard title="Quick access" subtitle="Use these shortcuts for a clean demo flow.">
        <div className="flex flex-wrap gap-3">
          <Link to="/log-workout" className={buttonStyles({ variant: 'primary' })}>
            Start workout log
          </Link>
          <Link to="/workouts" className={buttonStyles({ variant: 'outline' })}>
            Open exercise library
          </Link>
          <Link to="/food" className={buttonStyles({ variant: 'outline' })}>
            Track food
          </Link>
          <Link to="/analytics" className={buttonStyles({ variant: 'outline' })}>
            Review analytics
          </Link>
          <Link to="/profile" className={buttonStyles({ variant: 'ghost' })}>
            Update goals
          </Link>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <SectionCard title="Daily calorie summary" subtitle="Today&apos;s meal sections at a glance.">
          <div className="grid gap-4 sm:grid-cols-2">
            {dashboard.todayMeals.map((meal) => (
              <div
                key={meal.mealType}
                className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    {MEAL_TYPE_LABELS[meal.mealType]}
                  </h3>
                  <Badge tone={meal.itemCount > 0 ? 'emerald' : 'slate'}>
                    {meal.itemCount} item{meal.itemCount === 1 ? '' : 's'}
                  </Badge>
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                  {Math.round(meal.calories)}
                </p>
                <p className="mt-1 text-sm text-slate-500">Calories logged</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Target snapshot"
          subtitle="Profile goals and macro targets shown on the dashboard."
        >
          <div className="space-y-4">
            <div className="rounded-[22px] bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-900">Daily calorie target</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {dashboard.user.dailyCalorieTarget}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Protein</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{dashboard.user.proteinTarget}g</p>
              </div>
              <div className="rounded-[20px] bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Carbs</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{dashboard.user.carbsTarget}g</p>
              </div>
              <div className="rounded-[20px] bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Fats</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{dashboard.user.fatsTarget}g</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Weekly calorie momentum"
          subtitle="A quick visual story for the last 7 days of nutrition tracking."
        >
          <div className="grid h-64 grid-cols-7 items-end gap-3">
            {dashboard.weeklyCalories.map((day) => (
              <div key={day.date} className="flex h-full flex-col items-center justify-end gap-3">
                <span className="text-xs font-semibold text-slate-500">{Math.round(day.calories)}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-[18px] bg-gradient-to-t from-sky-500 via-cyan-400 to-emerald-300 shadow-[0_12px_20px_rgba(14,165,233,0.2)]"
                    style={{ height: `${Math.max((day.calories / weeklyCalorieMax) * 100, day.calories > 0 ? 10 : 0)}%` }}
                    title={`${day.date}: ${Math.round(day.calories)} calories`}
                  />
                </div>
                <p className="text-[11px] font-medium text-slate-500">{day.date.slice(5)}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Workout rhythm"
          subtitle="Sessions and training volume recorded across the last 7 days."
        >
          <div className="space-y-3">
            {dashboard.weeklyWorkouts.map((day) => (
              <div key={day.date} className="rounded-[18px] bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{day.date}</p>
                  <Badge tone={day.sessions > 0 ? 'emerald' : 'slate'}>
                    {day.sessions} session{day.sessions === 1 ? '' : 's'}
                  </Badge>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-slate-950"
                    style={{ width: `${Math.max((day.sessions / weeklyWorkoutMax) * 100, day.sessions > 0 ? 12 : 0)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">Volume: {formatVolume(day.volume)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent activity" subtitle="Latest logged workout sessions for your demo timeline.">
        {dashboard.recentSessions.length === 0 ? (
          <EmptyState
            title="No workout sessions yet"
            description="Create your first logged workout to populate recent activity and analytics."
            action={
              <Link to="/log-workout" className={buttonStyles({ variant: 'primary' })}>
                Log a workout
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {dashboard.recentSessions.map((session) => (
              <article
                key={session.id}
                className="rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">{session.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {session.date} • {session.durationMinutes ?? '--'} min
                    </p>
                  </div>
                  <Badge tone="sky">
                    {session.exercises.length} exercise{session.exercises.length === 1 ? '' : 's'}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {session.exercises.map((exercise) => (
                    <Badge key={exercise.id} tone="slate">
                      {exercise.workout.name}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </section>
  );
}
