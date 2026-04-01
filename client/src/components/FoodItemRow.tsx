import { useEffect, useState } from 'react';
import Badge from './Badge';
import Button from './Button';
import InputField from './InputField';
import { MealItem, MealItemInput } from '../types';

type Props = {
  item: MealItem;
  disabled?: boolean;
  onDelete: () => void;
  onSave: (values: MealItemInput) => Promise<void>;
};

type FormState = {
  name: string;
  quantity: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
};

function toFormState(item: MealItem): FormState {
  return {
    name: item.name,
    quantity: item.quantity,
    calories: String(item.calories),
    protein: item.protein?.toString() ?? '',
    carbs: item.carbs?.toString() ?? '',
    fats: item.fats?.toString() ?? ''
  };
}

function macroLabel(label: string, value: number | null) {
  return `${label}: ${value ?? 0}g`;
}

export default function FoodItemRow({ item, disabled, onDelete, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>(() => toFormState(item));
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(toFormState(item));
  }, [item]);

  const updateValue = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.quantity.trim()) {
      setError('Food name and quantity are required.');
      return;
    }

    const calories = Number(form.calories);
    if (Number.isNaN(calories) || calories < 0) {
      setError('Calories must be a non-negative number.');
      return;
    }

    const optionalValue = (value: string) => (value.trim() ? Number(value) : undefined);

    setError('');

    await onSave({
      name: form.name.trim(),
      quantity: form.quantity.trim(),
      calories,
      protein: optionalValue(form.protein),
      carbs: optionalValue(form.carbs),
      fats: optionalValue(form.fats)
    });

    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-[22px] border border-sky-100 bg-sky-50/70 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <InputField
            label="Food"
            value={form.name}
            onChange={(event) => updateValue('name', event.target.value)}
          />
          <InputField
            label="Quantity"
            value={form.quantity}
            onChange={(event) => updateValue('quantity', event.target.value)}
          />
          <InputField
            label="Calories"
            type="number"
            min="0"
            step="0.1"
            value={form.calories}
            onChange={(event) => updateValue('calories', event.target.value)}
          />
          <InputField
            label="Protein (g)"
            type="number"
            min="0"
            step="0.1"
            value={form.protein}
            onChange={(event) => updateValue('protein', event.target.value)}
          />
          <InputField
            label="Carbs (g)"
            type="number"
            min="0"
            step="0.1"
            value={form.carbs}
            onChange={(event) => updateValue('carbs', event.target.value)}
          />
          <InputField
            label="Fats (g)"
            type="number"
            min="0"
            step="0.1"
            value={form.fats}
            onChange={(event) => updateValue('fats', event.target.value)}
          />
        </div>
        {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={handleSave} disabled={disabled}>
            Save changes
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setForm(toFormState(item));
              setError('');
              setIsEditing(false);
            }}
            disabled={disabled}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-slate-100 bg-slate-50/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-slate-900">{item.name}</h4>
            <Badge tone="sky">{item.quantity}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="amber">{Math.round(item.calories)} kcal</Badge>
            <Badge tone="emerald">{macroLabel('Protein', item.protein)}</Badge>
            <Badge tone="sky">{macroLabel('Carbs', item.carbs)}</Badge>
            <Badge tone="rose">{macroLabel('Fats', item.fats)}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} disabled={disabled}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={onDelete} disabled={disabled}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
