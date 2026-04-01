import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState
} from 'react';
import { cn } from '../lib/cn';

type ToastTone = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastInput = Omit<Toast, 'id'>;

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClasses: Record<ToastTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900'
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo(
    () => ({
      showToast: (toast: ToastInput) => {
        const nextToast: Toast = {
          ...toast,
          id: Date.now() + Math.floor(Math.random() * 1000)
        };

        setToasts((current) => [...current, nextToast]);

        window.setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== nextToast.id));
        }, 2800);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,360px)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'rounded-2xl border px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur transition duration-200',
              toneClasses[toast.tone]
            )}
          >
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
