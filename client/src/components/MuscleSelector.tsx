import MuscleChip from './MuscleChip';

const options = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

type Props = {
  selected: string[];
  onChange: (muscles: string[]) => void;
};

export default function MuscleSelector({ selected, onChange }: Props) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        return (
          <MuscleChip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onClick={() => toggle(option)}
          />
        );
      })}
    </div>
  );
}
