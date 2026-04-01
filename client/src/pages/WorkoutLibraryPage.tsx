import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import InputField from '../components/InputField';
import LoadingState from '../components/LoadingState';
import MuscleSelector from '../components/MuscleSelector';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import WorkoutCard from '../components/WorkoutCard';
import { getWorkouts } from '../lib/api';

export default function WorkoutLibraryPage() {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');

  const workoutsQuery = useQuery({
    queryKey: ['workouts', [...selectedMuscles].sort().join(',')],
    queryFn: () => getWorkouts(selectedMuscles)
  });

  const filteredWorkouts = useMemo(() => {
    return (workoutsQuery.data?.workouts || []).filter((workout) => {
      const matchesSearch =
        workout.name.toLowerCase().includes(search.toLowerCase()) ||
        workout.equipment.toLowerCase().includes(search.toLowerCase()) ||
        workout.instructions.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficulty === 'ALL' || workout.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [difficulty, search, workoutsQuery.data]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workout Planner"
        title="Exercise library"
        subtitle="Browse the workout planner by muscle group, search term, and difficulty so the site feels like a real training platform in the browser."
      >
        <div className="rounded-[24px] border border-slate-100 bg-white/85 px-4 py-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">{filteredWorkouts.length} workouts visible</p>
          <p className="mt-1 text-sm text-slate-500">Instant filtering for a smooth demo</p>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Visible workouts" value={String(filteredWorkouts.length)} hint="Results after current filters" tone="sky" />
        <StatCard
          title="Muscle filters"
          value={selectedMuscles.length > 0 ? String(selectedMuscles.length) : 'All'}
          hint={selectedMuscles.length > 0 ? selectedMuscles.join(', ') : 'Showing the full library'}
          tone="emerald"
        />
        <StatCard title="Difficulty" value={difficulty === 'ALL' ? 'All' : difficulty.toLowerCase()} hint="Search updates live" tone="violet" />
      </div>

      <SectionCard
        title="Search and filter"
        subtitle="Tune the planner for the exact screen flow you want to present."
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              setDifficulty('ALL');
              setSelectedMuscles([]);
            }}
          >
            Clear filters
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1fr,auto]">
          <InputField
            label="Search workouts"
            placeholder="Search by name, equipment, or instructions"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Difficulty</span>
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDifficulty(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    difficulty === option
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {option === 'ALL' ? 'All levels' : option.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <MuscleSelector selected={selectedMuscles} onChange={setSelectedMuscles} />
        </div>
      </SectionCard>

      {workoutsQuery.isLoading ? <LoadingState title="Loading workouts" cards={6} /> : null}

      {workoutsQuery.error ? (
        <SectionCard className="border-rose-100 bg-rose-50/80" title="Unable to load workouts">
          <p className="text-sm font-medium text-rose-700">
            {(workoutsQuery.error as Error).message}
          </p>
        </SectionCard>
      ) : null}

      {!workoutsQuery.isLoading && !workoutsQuery.error && filteredWorkouts.length === 0 ? (
        <EmptyState
          title="No workouts match these filters"
          description="Try a different search term, change the difficulty, or clear your muscle group filters."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setDifficulty('ALL');
                setSelectedMuscles([]);
              }}
            >
              Show all workouts
            </Button>
          }
        />
      ) : null}

      {!workoutsQuery.isLoading && !workoutsQuery.error && filteredWorkouts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
