import { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner type="long" className="mr-2 h-4 w-4 animate-spin"/>
  }

  if (!isAuthenticated) {
    return null // middleware will handle redirect
  }

  return <>{children}</>
}