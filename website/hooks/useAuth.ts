import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const userInfo = await getCurrentUser();
      if (!userInfo) {
        router.push('/login')
      }
      
      setIsAuthenticated(true)
      setIsLoading(false)
    } catch (error) {
      setIsAuthenticated(false)
      setIsLoading(false)
      router.push('/login')
      console.error(error);
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return { isAuthenticated, isLoading }
}