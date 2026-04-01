import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import SelectField from '../components/SelectField';
import StatCard from '../components/StatCard';
import { useToast } from '../components/ToastProvider';
import { getProfile, updateProfile } from '../lib/api';
import { setStoredUser } from '../lib/auth';
import { FITNESS_GOAL_LABELS, FitnessGoal } from '../types';

type FormState = {
  displayName: string;
  fitnessGoal: FitnessGoal;
  dailyCalorieTarget: string;
  proteinTarget: string;
  carbsTarget: string;
  fatsTarget: string;
  currentWeight: string;
};

const initialForm: FormState = {
  displayName: '',
  fitnessGoal: 'MAINTENANCE',
  dailyCalorieTarget: '2200',
  proteinTarget: '150',
  carbsTarget: '220',
  fatsTarget: '70',
  currentWeight: ''
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  const [form, setForm] = useState<FormState>(initialForm);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!profileQuery.data) return;

    const profile = profileQuery.data.profile;
    setForm({
      displayName: profile.displayName || '',
      fitnessGoal: profile.fitnessGoal,
      dailyCalorieTarget: String(profile.dailyCalorieTarget),
      proteinTarget: String(profile.proteinTarget),
      carbsTarget: String(profile.carbsTarget),
      fatsTarget: String(profile.fatsTarget),
      currentWeight: profile.currentWeight?.toString() || ''
    });
  }, [profileQuery.data]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: ({ profile }) => {
      setStoredUser({
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        fitnessGoal: profile.fitnessGoal
      });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showToast({
        title: 'Profile updated',
        description: 'Goals and targets were saved successfully.',
        tone: 'success'
      });
    }
  });

  if (profileQuery.isLoading) {
    return <LoadingState title="Loading profile and goals" cards={4} />;
  }

  if (profileQuery.error) {
    return (
      <SectionCard className="border-rose-100 bg-rose-50/80" title="Unable to load profile">
        <p className="text-sm font-medium text-rose-700">
          {(profileQuery.error as Error).message}
        </p>
      </SectionCard>
    );
  }

  const updateValue = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    setFormError('');

    if (form.displayName.trim().length < 2) {
      setFormError('Display name must be at least 2 characters.');
      return;
    }

    await mutation.mutateAsync({
      displayName: form.displayName.trim(),
      fitnessGoal: form.fitnessGoal,
      dailyCalorieTarget: Number(form.dailyCalorieTarget),
      proteinTarget: Number(form.proteinTarget),
      carbsTarget: Number(form.carbsTarget),
      fatsTarget: Number(form.fatsTarget),
      currentWeight: form.currentWeight.trim() ? Number(form.currentWeight) : undefined
    });
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Profile and goal settings"
        subtitle="Personalize the website with your display name, fitness goal, calorie target, macro targets, and optional body weight."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Goal" value={FITNESS_GOAL_LABELS[form.fitnessGoal]} hint="Current objective" tone="emerald" />
        <StatCard title="Calories" value={form.dailyCalorieTarget} hint="Daily target" tone="amber" />
        <StatCard title="Protein" value={`${form.proteinTarget}g`} hint="Recovery support" tone="sky" />
        <StatCard title="Weight" value={form.currentWeight || '--'} hint="Optional body weight" tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <SectionCard title="Account and targets" subtitle="These values drive the dashboard summary and goals experience.">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Display name"
              value={form.displayName}
              onChange={(event) => updateValue('displayName', event.target.value)}
            />
            <SelectField
              label="Fitness goal"
              value={form.fitnessGoal}
              onChange={(event) => updateValue('fitnessGoal', event.target.value as FitnessGoal)}
              options={Object.entries(FITNESS_GOAL_LABELS).map(([value, label]) => ({
                value,
                label
              }))}
            />
            <InputField
              label="Daily calorie target"
              type="number"
              value={form.dailyCalorieTarget}
              onChange={(event) => updateValue('dailyCalorieTarget', event.target.value)}
            />
            <InputField
              label="Current weight"
              type="number"
              step="0.1"
              value={form.currentWeight}
              onChange={(event) => updateValue('currentWeight', event.target.value)}
              hint="Optional"
            />
            <InputField
              label="Protein target (g)"
              type="number"
              value={form.proteinTarget}
              onChange={(event) => updateValue('proteinTarget', event.target.value)}
            />
            <InputField
              label="Carb target (g)"
              type="number"
              value={form.carbsTarget}
              onChange={(event) => updateValue('carbsTarget', event.target.value)}
            />
            <InputField
              label="Fat target (g)"
              type="number"
              value={form.fatsTarget}
              onChange={(event) => updateValue('fatsTarget', event.target.value)}
            />
          </div>

          {formError ? <p className="mt-4 text-sm font-medium text-rose-600">{formError}</p> : null}
          {mutation.error ? (
            <p className="mt-4 text-sm font-medium text-rose-600">
              {(mutation.error as Error).message}
            </p>
          ) : null}

          <div className="mt-5">
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Why this matters" subtitle="These settings improve the demo story and make the website feel personalized.">
          <div className="space-y-4 text-sm leading-6 text-slate-600">
            <div className="rounded-[20px] bg-slate-50/80 p-4">
              <p className="font-semibold text-slate-900">Dashboard personalization</p>
              <p className="mt-2">The dashboard uses these targets to show calorie pacing, goal labels, and quick user-specific context.</p>
            </div>
            <div className="rounded-[20px] bg-slate-50/80 p-4">
              <p className="font-semibold text-slate-900">Analytics context</p>
              <p className="mt-2">Macro targets make the nutrition story easier to explain during a screen recording or live presentation.</p>
            </div>
            <div className="rounded-[20px] bg-slate-50/80 p-4">
              <p className="font-semibold text-slate-900">Submission readiness</p>
              <p className="mt-2">A proper profile page helps the project feel like a complete web product instead of a disconnected tracker.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
