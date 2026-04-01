type Props = {
  title?: string;
  lines?: number;
  cards?: number;
};

export default function LoadingState({
  title = 'Loading content',
  lines = 3,
  cards = 0
}: Props) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
      <p className="mb-4 text-sm font-medium text-slate-500">{title}</p>
      <div className="space-y-3">
        {cards > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: cards }, (_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-[22px] bg-gradient-to-br from-slate-100 to-slate-50"
              />
            ))}
          </div>
        ) : null}
        {cards === 0
          ? Array.from({ length: lines }, (_, index) => (
              <div
                key={index}
                className="h-4 animate-pulse rounded-full bg-gradient-to-r from-slate-100 to-slate-50"
                style={{ width: `${95 - index * 10}%` }}
              />
            ))
          : null}
      </div>
    </div>
  );
}
