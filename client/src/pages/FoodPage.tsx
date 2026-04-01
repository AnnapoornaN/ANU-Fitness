import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { buttonStyles } from '../components/Button';
import EmptyState from '../components/EmptyState';
import FoodItemRow from '../components/FoodItemRow';
import LoadingState from '../components/LoadingState';
import MealCard from '../components/MealCard';
import MealForm from '../components/MealForm';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { useToast } from '../components/ToastProvider';
import TotalsPanel from '../components/TotalsPanel';
import {
  createMealEntry,
  deleteMealEntry,
  getDailyAnalytics,
  getMeals,
  updateMealEntry
} from '../lib/api';
import { todayISO } from '../lib/date';
import { MealEntry, MealItem, MealItemInput, MealType, MEAL_TYPES, MEAL_TYPE_LABELS } from '../types';

function toMealItemInput(item: MealItem): MealItemInput {
  return {
    name: item.name,
    quantity: item.quantity,
    calories: item.calories,
    protein: item.protein ?? undefined,
    carbs: item.carbs ?? undefined,
    fats: item.fats ?? undefined
  };
}

export default function FoodPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [activeMealType, setActiveMealType] = useState<MealType>('BREAKFAST');

  const mealsQuery = useQuery({
    queryKey: ['meals', selectedDate],
    queryFn: () => getMeals(selectedDate)
  });

  const dailyQuery = useQuery({
    queryKey: ['daily', selectedDate],
    queryFn: () => getDailyAnalytics(selectedDate)
  });

  const addMealMutation = useMutation({
    mutationFn: (item: MealItemInput) =>
      createMealEntry({
        date: selectedDate,
        mealType: activeMealType,
        items: [item]
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['meals', selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ['daily', selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ['weekly'] });
      showToast({
        title: 'Meal item added',
        description: `Saved to ${MEAL_TYPE_LABELS[activeMealType]}.`,
        tone: 'success'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMealEntry(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['meals', selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ['daily', selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ['weekly'] });
      showToast({
        title: 'Meal entry removed',
        description: 'The item was removed from your day log.',
        tone: 'success'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({
      entry,
      items
    }: {
      entry: MealEntry;
      items: MealItemInput[];
    }) =>
      updateMealEntry(entry.id, {
        date: entry.date,
        mealType: entry.mealType,
        items
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['meals', selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ['daily', selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ['weekly'] });
    }
  });

  const groupedMeals = useMemo(() => {
    const initial = Object.fromEntries(
      MEAL_TYPES.map((mealType) => [mealType, [] as MealEntry[]])
    ) as Record<MealType, MealEntry[]>;

    for (const meal of mealsQuery.data?.meals || []) {
      initial[meal.mealType].push(meal);
    }

    return initial;
  }, [mealsQuery.data]);

  const totalItemsToday = (mealsQuery.data?.meals ?? []).reduce(
    (sum, entry) => sum + entry.items.length,
    0
  );
  const activeMealItems = groupedMeals[activeMealType].reduce(
    (sum, entry) => sum + entry.items.length,
    0
  );

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Food tracker"
        title="Daily nutrition tracking"
        subtitle="Log meals by date, keep macros presentation-ready, and show a clear daily nutrition summary during your demo."
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

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Items logged" value={String(totalItemsToday)} hint="Across all meal sections" tone="sky" />
        <StatCard
          title="Active meal tab"
          value={MEAL_TYPE_LABELS[activeMealType]}
          hint={`${activeMealItems} item${activeMealItems === 1 ? '' : 's'} in this section`}
          tone="emerald"
        />
        <StatCard title="Selected date" value={selectedDate.slice(5)} hint={selectedDate} tone="violet" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
        <MealForm
          mealType={activeMealType}
          isSubmitting={addMealMutation.isPending}
          onSubmit={async (item) => {
            await addMealMutation.mutateAsync(item);
          }}
        />

        <SectionCard
          title="Meal navigation"
          subtitle="Switch tabs to log food into the right meal bucket."
        >
          <div className="flex flex-wrap gap-2">
            {MEAL_TYPES.map((mealType) => {
              const active = mealType === activeMealType;
              const count = groupedMeals[mealType].reduce((sum, entry) => sum + entry.items.length, 0);

              return (
                <button
                  key={mealType}
                  onClick={() => setActiveMealType(mealType)}
                  className={
                    active
                      ? buttonStyles({ variant: 'primary', size: 'sm' })
                      : buttonStyles({ variant: 'outline', size: 'sm' })
                  }
                >
                  {MEAL_TYPE_LABELS[mealType]} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[22px] bg-slate-50/80 p-4">
            <p className="text-sm font-semibold text-slate-900">{MEAL_TYPE_LABELS[activeMealType]} is active</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add one item at a time, then refine or remove entries below using the inline controls.
            </p>
          </div>
        </SectionCard>
      </div>

      {addMealMutation.error ? (
        <SectionCard className="border-rose-100 bg-rose-50/80" title="Unable to save this food item">
          <p className="text-sm font-medium text-rose-700">
            {(addMealMutation.error as Error).message}
          </p>
        </SectionCard>
      ) : null}

      {updateMutation.error ? (
        <SectionCard className="border-rose-100 bg-rose-50/80" title="Unable to update the meal item">
          <p className="text-sm font-medium text-rose-700">
            {(updateMutation.error as Error).message}
          </p>
        </SectionCard>
      ) : null}

      {mealsQuery.error ? (
        <SectionCard className="border-rose-100 bg-rose-50/80" title="Unable to load meals">
          <p className="text-sm font-medium text-rose-700">
            {(mealsQuery.error as Error).message}
          </p>
        </SectionCard>
      ) : null}

      <TotalsPanel
        title={`Daily totals for ${selectedDate}`}
        totals={dailyQuery.data?.totals}
        isLoading={dailyQuery.isLoading}
      />

      {dailyQuery.error ? (
        <SectionCard className="border-rose-100 bg-rose-50/80" title="Unable to load daily totals">
          <p className="text-sm font-medium text-rose-700">
            {(dailyQuery.error as Error).message}
          </p>
        </SectionCard>
      ) : null}

      {mealsQuery.isLoading ? <LoadingState title="Loading meals for your selected day" cards={4} /> : null}

      {!mealsQuery.isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {MEAL_TYPES.map((mealType) => {
            const entries = groupedMeals[mealType];
            const itemCount = entries.reduce((sum, entry) => sum + entry.items.length, 0);

            return (
              <MealCard key={mealType} title={MEAL_TYPE_LABELS[mealType]} count={itemCount}>
                {entries.length === 0 ? (
                  <EmptyState
                    title={`No ${MEAL_TYPE_LABELS[mealType].toLowerCase()} logged`}
                    description="Use the form above to add a food item and populate this meal section."
                  />
                ) : (
                  <div className="space-y-3">
                    {entries.map((entry) =>
                      entry.items.map((item) => (
                        <FoodItemRow
                          key={item.id}
                          item={item}
                          disabled={deleteMutation.isPending || updateMutation.isPending}
                          onDelete={() => {
                            if (entry.items.length === 1) {
                              deleteMutation.mutate(entry.id);
                              return;
                            }

                            void (async () => {
                              await updateMutation.mutateAsync({
                                entry,
                                items: entry.items
                                  .filter((existingItem) => existingItem.id !== item.id)
                                  .map(toMealItemInput)
                              });

                              showToast({
                                title: 'Meal item removed',
                                description: `${item.name} was removed from ${MEAL_TYPE_LABELS[entry.mealType]}.`,
                                tone: 'success'
                              });
                            })();
                          }}
                          onSave={async (values) => {
                            await updateMutation.mutateAsync({
                              entry,
                              items: entry.items.map((existingItem) =>
                                existingItem.id === item.id ? values : toMealItemInput(existingItem)
                              )
                            });

                            showToast({
                              title: 'Meal item updated',
                              description: `${item.name} was refreshed with your latest values.`,
                              tone: 'success'
                            });
                          }}
                        />
                      ))
                    )}
                  </div>
                )}
              </MealCard>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
