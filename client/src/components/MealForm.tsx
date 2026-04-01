import { FormEvent, useMemo, useState } from 'react';
import Button from './Button';
import InputField from './InputField';
import SectionCard from './SectionCard';
import { MealItemInput, MealType, MEAL_TYPE_LABELS } from '../types';

type Props = {
  mealType: MealType;
  isSubmitting: boolean;
  onSubmit: (item: MealItemInput) => Promise<void> | void;
};

type FormState = {
  name: string;
  quantity: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: '',
  quantity: '',
  calories: '',
  protein: '',
  carbs: '',
  fats: ''
};

export default function MealForm({ mealType, isSubmitting, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const title = useMemo(() => `Add item to ${MEAL_TYPE_LABELS[mealType]}`, [mealType]);

  const setValue = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Food name is required';
    if (!form.quantity.trim()) nextErrors.quantity = 'Quantity is required';

    const calories = Number(form.calories);
    if (!form.calories.trim() || Number.isNaN(calories) || calories < 0) {
      nextErrors.calories = 'Calories must be a non-negative number';
    }

    const optionalKeys: Array<keyof Pick<FormState, 'protein' | 'carbs' | 'fats'>> = [
      'protein',
      'carbs',
      'fats'
    ];

    for (const key of optionalKeys) {
      if (form[key].trim()) {
        const value = Number(form[key]);
        if (Number.isNaN(value) || value < 0) {
          nextErrors[key] = 'Must be a non-negative number';
        }
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      name: form.name.trim(),
      quantity: form.quantity.trim(),
      calories: Number(form.calories),
      protein: form.protein.trim() ? Number(form.protein) : undefined,
      carbs: form.carbs.trim() ? Number(form.carbs) : undefined,
      fats: form.fats.trim() ? Number(form.fats) : undefined
    });

    setForm(initialForm);
  };

  return (
    <SectionCard
      title={title}
      subtitle="Track one food item at a time with calories and optional macros."
      className="h-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Food item"
            placeholder="Greek yogurt"
            value={form.name}
            onChange={(e) => setValue('name', e.target.value)}
            error={errors.name}
          />
          <InputField
            label="Quantity"
            placeholder="1 cup"
            value={form.quantity}
            onChange={(e) => setValue('quantity', e.target.value)}
            error={errors.quantity}
          />
          <InputField
            label="Calories"
            type="number"
            min="0"
            step="0.1"
            placeholder="250"
            value={form.calories}
            onChange={(e) => setValue('calories', e.target.value)}
            error={errors.calories}
          />
          <InputField
            label="Protein (g)"
            type="number"
            min="0"
            step="0.1"
            placeholder="Optional"
            value={form.protein}
            onChange={(e) => setValue('protein', e.target.value)}
            error={errors.protein}
          />
          <InputField
            label="Carbs (g)"
            type="number"
            min="0"
            step="0.1"
            placeholder="Optional"
            value={form.carbs}
            onChange={(e) => setValue('carbs', e.target.value)}
            error={errors.carbs}
          />
          <InputField
            label="Fats (g)"
            type="number"
            min="0"
            step="0.1"
            placeholder="Optional"
            value={form.fats}
            onChange={(e) => setValue('fats', e.target.value)}
            error={errors.fats}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Tip: keep quantities presentation-friendly, like <span className="font-medium">1 bowl</span> or{' '}
            <span className="font-medium">2 slices</span>.
          </p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add item'}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
