import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import InputField from '../components/InputField';
import LoadingState from '../components/LoadingState';
import MuscleSelector from '../components/MuscleSelector';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import TextAreaField from '../components/TextAreaField';
import { useToast } from '../components/ToastProvider';
import {
  createWorkoutSession,
  deleteWorkoutSession,
  getWorkoutSessions,
  getWorkouts
} from '../lib/api';
import { todayISO } from '../lib/date';

type DraftSet = {
  reps: string;
  weight: string;
};

type DraftExercise = {
  workoutId: number;
  notes: string;
  sets: DraftSet[];
};

const emptySet = (): DraftSet => ({ reps: '10', weight: '' });

export default function WorkoutLogPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayISO());
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<DraftExercise[]>([]);

  const workoutsQuery = useQuery({
    queryKey: ['workouts', 'log', [...selectedMuscles].sort().join(',')],
    queryFn: () => getWorkouts(selectedMuscles)
  });

  const historyQuery = useQuery({
    queryKey: ['workout-sessions'],
    queryFn: () => getWorkoutSessions({ limit: 8 })
  });

  const createMutation = useMutation({
    mutationFn: createWorkoutSession,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workout-sessions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['workoutAnalytics'] })
      ]);

      setTitle('');
      setDate(todayISO());
      setDurationMinutes('45');
      setNotes('');
      setSelectedExercises([]);
      setFormError('');

      showToast({
        title: 'Workout session saved',
        description: 'Your new session was added to history and analytics.',
        tone: 'success'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkoutSession,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workout-sessions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['workoutAnalytics'] })
      ]);

      showToast({
        title: 'Workout session removed',
        description: 'History and analytics were refreshed.',
        tone: 'success'
      });
    }
  });

  const workoutsById = useMemo(
    () => new Map((workoutsQuery.data?.workouts || []).map((workout) => [workout.id, workout])),
    [workoutsQuery.data]
  );

  const filteredWorkouts = useMemo(() => {
    return (workoutsQuery.data?.workouts || []).filter((workout) => {
      if (selectedExercises.some((item) => item.workoutId === workout.id)) {
        return false;
      }

      const searchValue = search.toLowerCase();
      return (
        workout.name.toLowerCase().includes(searchValue) ||
        workout.equipment.toLowerCase().includes(searchValue)
      );
    });
  }, [search, selectedExercises, workoutsQuery.data]);

  const updateExercise = (index: number, updater: (exercise: DraftExercise) => DraftExercise) => {
    setSelectedExercises((current) =>
      current.map((exercise, currentIndex) =>
        currentIndex === index ? updater(exercise) : exercise
      )
    );
  };

  const handleAddExercise = (workoutId: number) => {
    setSelectedExercises((current) => [...current, { workoutId, notes: '', sets: [emptySet()] }]);

    if (!title.trim()) {
      const workout = workoutsById.get(workoutId);
      if (workout) {
        setTitle(`${workout.name} Session`);
      }
    }
  };

  const handleSaveWorkout = async () => {
    setFormError('');

    if (title.trim().length < 2) {
      setFormError('Workout title must be at least 2 characters.');
      return;
    }

    if (selectedExercises.length === 0) {
      setFormError('Add at least one exercise to the session.');
      return;
    }

    for (const exercise of selectedExercises) {
      if (exercise.sets.length === 0) {
        setFormError('Each exercise needs at least one set.');
        return;
      }

      for (const set of exercise.sets) {
        const reps = Number(set.reps);
        const weight = set.weight.trim() ? Number(set.weight) : undefined;

        if (Number.isNaN(reps) || reps <= 0) {
          setFormError('Every set needs a positive reps value.');
          return;
        }

        if (weight !== undefined && (Number.isNaN(weight) || weight < 0)) {
          setFormError('Weight values must be non-negative.');
          return;
        }
      }
    }

    await createMutation.mutateAsync({
      title: title.trim(),
      date,
      notes: notes.trim() || undefined,
      durationMinutes: durationMinutes.trim() ? Number(durationMinutes) : undefined,
      exercises: selectedExercises.map((exercise) => ({
        workoutId: exercise.workoutId,
        notes: exercise.notes.trim() || undefined,
        sets: exercise.sets.map((set) => ({
          reps: Number(set.reps),
          weight: set.weight.trim() ? Number(set.weight) : undefined
        }))
      }))
    });
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Workout Logging"
        title="Log a workout session"
        subtitle="Create a clean session record with selected exercises, sets, reps, weight, duration, and notes. This is the core browser-based logging flow."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <SectionCard title="Session details" subtitle="Set up the workout before choosing exercises.">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Workout title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <InputField label="Date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            <InputField
              label="Duration (minutes)"
              type="number"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
            />
            <div className="sm:col-span-2">
              <TextAreaField
                label="Session notes"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                hint="Optional training notes, cues, or presentation talking points"
              />
            </div>
          </div>
          {formError ? <p className="mt-4 text-sm font-medium text-rose-600">{formError}</p> : null}
          {createMutation.error ? (
            <p className="mt-4 text-sm font-medium text-rose-600">
              {(createMutation.error as Error).message}
            </p>
          ) : null}
        </SectionCard>

        <SectionCard title="Exercise picker" subtitle="Filter the library and add exercises into the current session.">
          <div className="grid gap-4">
            <InputField
              label="Search exercises"
              placeholder="Search by name or equipment"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <MuscleSelector selected={selectedMuscles} onChange={setSelectedMuscles} />
          </div>

          {workoutsQuery.isLoading ? (
            <div className="mt-5">
              <LoadingState title="Loading exercises" cards={3} />
            </div>
          ) : null}

          {!workoutsQuery.isLoading ? (
            <div className="mt-5 grid max-h-[420px] gap-3 overflow-y-auto pr-1">
              {filteredWorkouts.slice(0, 12).map((workout) => (
                <div key={workout.id} className="rounded-[20px] border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{workout.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {workout.targetMuscle.toLowerCase()} • {workout.equipment}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => handleAddExercise(workout.id)}>
                      Add
                    </Button>
                  </div>
                </div>
              ))}
              {filteredWorkouts.length === 0 ? (
                <EmptyState
                  title="No exercises available"
                  description="Try a different search or clear a muscle filter to find more workouts."
                />
              ) : null}
            </div>
          ) : null}
        </SectionCard>
      </div>

      <SectionCard
        title="Session builder"
        subtitle="Organize your selected exercises, add notes, and track each set with reps and weight."
        actions={
          <Button onClick={handleSaveWorkout} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Save workout session'}
          </Button>
        }
      >
        {selectedExercises.length === 0 ? (
          <EmptyState
            title="No exercises selected yet"
            description="Use the exercise picker above to build your session."
          />
        ) : (
          <div className="space-y-4">
            {selectedExercises.map((exercise, index) => {
              const workout = workoutsById.get(exercise.workoutId);
              if (!workout) return null;

              return (
                <div key={exercise.workoutId} className="rounded-[24px] border border-slate-100 bg-white/95 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{workout.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {workout.targetMuscle.toLowerCase()} • {workout.equipment}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        setSelectedExercises((current) =>
                          current.filter((_, currentIndex) => currentIndex !== index)
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="mt-4">
                    <TextAreaField
                      label="Exercise notes"
                      rows={2}
                      value={exercise.notes}
                      onChange={(event) =>
                        updateExercise(index, (current) => ({
                          ...current,
                          notes: event.target.value
                        }))
                      }
                    />
                  </div>

                  <div className="mt-4 grid gap-3">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid gap-3 rounded-[18px] bg-slate-50/80 p-4 sm:grid-cols-[auto,1fr,1fr,auto] sm:items-end">
                        <Badge tone="sky">Set {setIndex + 1}</Badge>
                        <InputField
                          label="Reps"
                          type="number"
                          min="1"
                          value={set.reps}
                          onChange={(event) =>
                            updateExercise(index, (current) => ({
                              ...current,
                              sets: current.sets.map((currentSet, currentSetIndex) =>
                                currentSetIndex === setIndex
                                  ? { ...currentSet, reps: event.target.value }
                                  : currentSet
                              )
                            }))
                          }
                        />
                        <InputField
                          label="Weight"
                          type="number"
                          min="0"
                          step="0.5"
                          value={set.weight}
                          onChange={(event) =>
                            updateExercise(index, (current) => ({
                              ...current,
                              sets: current.sets.map((currentSet, currentSetIndex) =>
                                currentSetIndex === setIndex
                                  ? { ...currentSet, weight: event.target.value }
                                  : currentSet
                              )
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateExercise(index, (current) => ({
                              ...current,
                              sets:
                                current.sets.length === 1
                                  ? current.sets
                                  : current.sets.filter((_, currentSetIndex) => currentSetIndex !== setIndex)
                            }))
                          }
                        >
                          Remove set
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateExercise(index, (current) => ({
                          ...current,
                          sets: [...current.sets, emptySet()]
                        }))
                      }
                    >
                      Add set
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Workout history" subtitle="Recent logged sessions are shown here for easy demo storytelling.">
        {historyQuery.isLoading ? <LoadingState title="Loading workout history" cards={3} /> : null}
        {historyQuery.error ? (
          <p className="text-sm font-medium text-rose-600">
            {(historyQuery.error as Error).message}
          </p>
        ) : null}

        {!historyQuery.isLoading && !historyQuery.error ? (
          historyQuery.data?.sessions.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {historyQuery.data.sessions.map((session) => (
                <article key={session.id} className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{session.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {session.date} • {session.durationMinutes ?? '--'} min
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteMutation.mutate(session.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {session.exercises.map((exercise) => (
                      <Badge key={exercise.id} tone="slate">
                        {exercise.workout.name} • {exercise.sets.length} set{exercise.sets.length === 1 ? '' : 's'}
                      </Badge>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No workout history yet"
              description="Save your first workout session to populate recent history."
            />
          )
        ) : null}
      </SectionCard>
    </section>
  );
}
