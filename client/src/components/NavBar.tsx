import { NavLink, useNavigate } from 'react-router-dom';
import { clearSession, getStoredUser } from '../lib/auth';
import Badge from './Badge';
import Button from './Button';
import { cn } from '../lib/cn';

const linkStyles = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ease-in-out',
    isActive
      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  );

export default function NavBar() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const goalLabel = user ? user.fitnessGoal.replace('_', ' ') : null;

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Dashboard', short: 'Home' },
    { to: '/workouts', label: 'Workout Planner', short: 'Planner' },
    { to: '/log-workout', label: 'Workout Logging', short: 'Log' },
    { to: '/food', label: 'Nutrition Tracker', short: 'Food' },
    { to: '/analytics', label: 'Analytics', short: 'Insights' },
    { to: '/profile', label: 'Profile & Goals', short: 'Profile' }
  ];

  return (
    <aside className="w-full shrink-0 border-b border-white/60 bg-white/80 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-[290px] lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-4 sm:px-6 lg:px-5">
        <div className="flex items-center gap-3 rounded-[28px] bg-slate-950 px-4 py-4 text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-300 text-lg font-bold text-slate-950">
            A
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Anu&apos;s Fitness</p>
            <p className="text-sm text-slate-300">Demo-ready web dashboard</p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-100 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Active user</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-lg font-semibold text-sky-700">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user?.displayName || user?.username || 'Guest'}
              </p>
              <p className="text-sm text-slate-500">@{user?.username || 'anu'}</p>
            </div>
          </div>
          {user && goalLabel ? (
            <Badge tone="emerald" className="mt-3">
              {goalLabel}
            </Badge>
          ) : null}
        </div>

        <nav className="mt-5 grid gap-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkStyles} end={link.to === '/'}>
              <span>{link.label}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-current/70">
                {link.short}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/80 p-4">
          <p className="text-sm font-semibold text-slate-900">Presentation flow</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Start at the dashboard, open workout logging, then show food tracking, analytics, and profile targets.
          </p>
        </div>

        <div className="mt-auto pt-5">
          <Button onClick={handleLogout} variant="danger" block>
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
