import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { getHealth, login, register } from '../lib/api';
import { clearSession, setSession } from '../lib/auth';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode: Mode = location.pathname === '/register' ? 'register' : 'login';

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const title = useMemo(
    () => (mode === 'login' ? "Login to Anu's Fitness" : 'Create your account'),
    [mode]
  );

  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    retry: false,
    refetchOnWindowFocus: false
  });

  const subtitle = useMemo(
    () =>
      mode === 'login'
        ? 'Fresh session mode is enabled here, so stale tokens are cleared automatically before sign-in.'
        : 'Create a local account for your own workout, nutrition, and analytics data.',
    [mode]
  );

  const mutation = useMutation({
    mutationFn: (payload: { username: string; password: string; displayName?: string }) =>
      mode === 'login' ? login(payload) : register(payload),
    onSuccess: (data) => {
      setSession(data.token, data.user);
      navigate('/');
    }
  });

  useEffect(() => {
    clearSession();
    setFormError('');
    mutation.reset();
  }, [location.pathname]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (mode === 'register' && displayName.trim().length < 2) {
      setFormError('Display name must be at least 2 characters');
      return;
    }

    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    mutation.mutate({
      username: username.trim(),
      password,
      displayName: mode === 'register' ? displayName.trim() : undefined
    });
  };

  const applyDemoCredentials = () => {
    setUsername('demo_anu');
    setPassword('fitness123');
    setFormError('');
    mutation.reset();
  };

  const loginWithDemo = () => {
    setUsername('demo_anu');
    setPassword('fitness123');
    setFormError('');
    mutation.reset();
    mutation.mutate({
      username: 'demo_anu',
      password: 'fitness123'
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(74,222,128,0.14),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eff6fb_100%)]" />
      <div className="pointer-events-none absolute left-[10%] top-[15%] h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] top-[20%] h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-white/88 shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur lg:grid-cols-[1fr,1.02fr]">
        <div className="hidden bg-[linear-gradient(145deg,_#0f172a,_#0f766e)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold shadow-inner">
              A
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">
                Welcome to Anu&apos;s Fitness
              </p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Plan, log, and review your progress in one polished fitness website.
              </h2>
              <p className="max-w-md text-sm leading-6 text-slate-200">
                Built for clean university demos with workout planning, logging, nutrition tracking, analytics, and goals in one browser-first experience.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Demo mode</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                One click restores a fresh demo account with workouts, meals, analytics, and profile targets.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Stable browser flow</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                The login page now clears stale local session data automatically so broken old tokens do not block access.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">
              Local Account Access
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
            <p className="max-w-md text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          <div className="mt-8 flex rounded-2xl bg-slate-100 p-1.5">
            <Link
              to="/login"
              className={`flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold transition duration-200 ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-[0_12px_26px_rgba(15,23,42,0.08)]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold transition duration-200 ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-[0_12px_26px_rgba(15,23,42,0.08)]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </Link>
          </div>

          {healthQuery.error ? (
            <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              API server is offline. Start the backend with <span className="font-semibold">`npm run dev --prefix server`</span> and refresh this page, or keep using the demo account in offline mode.
            </div>
          ) : null}

          {mode === 'login' ? (
            <div className="mt-6 rounded-[24px] border border-emerald-100 bg-emerald-50/75 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-950">Presentation demo account</p>
                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    Username: <span className="font-semibold">demo_anu</span> and password:{' '}
                    <span className="font-semibold">fitness123</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={applyDemoCredentials}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-100"
                  >
                    Fill demo fields
                  </button>
                  <button
                    type="button"
                    onClick={loginWithDemo}
                    disabled={mutation.isPending}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                  >
                    {mutation.isPending ? 'Signing in...' : 'Continue with demo'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === 'register' ? (
              <InputField
                id="displayName"
                label="Display name"
                placeholder="Anu Demo"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
              />
            ) : null}

            <InputField
              id="username"
              label="Username"
              placeholder="anu_fitness_demo"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />

            <div className="space-y-2">
              <InputField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
            </div>

            {formError ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {formError}
              </div>
            ) : null}

            {mutation.error ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {(mutation.error as Error).message}
              </div>
            ) : null}

            <Button type="submit" disabled={mutation.isPending} block size="lg">
              {mutation.isPending
                ? 'Please wait...'
                : mode === 'login'
                ? 'Enter dashboard'
                : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
