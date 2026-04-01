import { useState } from 'react';
import Badge from './Badge';
import Button, { buttonStyles } from './Button';
import { cn } from '../lib/cn';
import { MUSCLE_LABELS, Workout } from '../types';

type Props = {
  workout: Workout;
};

function formatDifficulty(value: string) {
  return value[0] + value.slice(1).toLowerCase();
}

function difficultyTone(difficulty: Workout['difficulty']) {
  if (difficulty === 'BEGINNER') return 'emerald';
  if (difficulty === 'INTERMEDIATE') return 'sky';
  return 'amber';
}

function EquipmentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10v4" />
      <path d="M21 10v4" />
      <path d="M7 8v8" />
      <path d="M17 8v8" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="M9 12h6" />
    </svg>
  );
}

function DifficultyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 18 11 6l2 5 6 2-6 5-2-4-6 4Z" />
    </svg>
  );
}

export default function WorkoutCard({ workout }: Props) {
  const [expanded, setExpanded] = useState(false);
  const previewStyles = !expanded
    ? ({
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      } as const)
    : undefined;

  return (
    <article className="group rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{workout.name}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge tone="sky">{MUSCLE_LABELS[workout.targetMuscle]}</Badge>
            <Badge tone={difficultyTone(workout.difficulty)}>{formatDifficulty(workout.difficulty)}</Badge>
          </div>
        </div>
        <div className="rounded-2xl bg-sky-50 p-3 text-sky-600 shadow-sm transition duration-200 group-hover:bg-sky-100">
          <EquipmentIcon />
        </div>
      </div>

      <div className="mb-4 grid gap-3 rounded-[20px] bg-slate-50/85 p-4 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <EquipmentIcon />
          <span>{workout.equipment}</span>
        </div>
        <div className="flex items-center gap-2">
          <DifficultyIcon />
          <span>{formatDifficulty(workout.difficulty)} level</span>
        </div>
      </div>

      <div className="space-y-3">
        {!expanded ? (
          <p className="text-sm leading-6 text-slate-600" style={previewStyles}>
            {workout.instructions}
          </p>
        ) : null}

        <div
          className={cn(
            'grid overflow-hidden transition-all duration-300 ease-in-out',
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          )}
        >
          <div className="overflow-hidden">
            <div className="rounded-[18px] border border-sky-100 bg-sky-50/60 p-4 text-sm leading-6 text-slate-700">
              {workout.instructions}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="outline" size="sm" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Show less' : 'Read more'}
        </Button>
        {workout.videoLink ? (
          <a
            href={workout.videoLink}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles({ variant: 'secondary', size: 'sm' })}
          >
            Watch video
          </a>
        ) : null}
      </div>
    </article>
  );
}
