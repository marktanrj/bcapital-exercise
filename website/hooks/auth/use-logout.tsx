"use client"

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth-api';
import { useAuthStore } from "@/store/auth-store";
import { deleteCookie } from 'cookies-next/client';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const useLogout = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: () => 
      authApi.logout(),
    onSuccess: () => {
      setUser(null);

      const isProd = process.env.NODE_ENV === 'production';
      console.log(process.env.NODE_ENV);
      deleteCookie('sessionId', {
        path: '/',
        domain: isProd ? '.marksite.xyz' : undefined,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax'
      });

      router.push('/login');
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message ?? 'Log out error';
      console.error(errorMessage);
    },
  });

  const logout = () => {
    mutation.mutate();
  };

  return {
    logout,
    isLoading: mutation.isPending,
  };
};