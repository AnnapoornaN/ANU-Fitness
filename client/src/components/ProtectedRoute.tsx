import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/api';
import { clearSession, getToken, setStoredUser } from '../lib/auth';
import LoadingState from './LoadingState';

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const token = getToken();
  const sessionQuery = useQuery({
    queryKey: ['session-user'],
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    retry: false
  });

  useEffect(() => {
    if (sessionQuery.data?.user) {
      setStoredUser(sessionQuery.data.user);
    }
  }, [sessionQuery.data]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (sessionQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <LoadingState title="Restoring your session" cards={3} />
      </div>
    );
  }

  if (sessionQuery.error) {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
