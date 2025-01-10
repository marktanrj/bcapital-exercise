import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth-api';
import { useAuthStore } from "@/store/auth-store";

type LoginData = {
  username: string;
  password: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: (data: LoginData) => 
      authApi.login(data.username, data.password),
    onSuccess: (data) => {
      setUser(data);
      setError('');
      router.push('/chat');
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message ?? 'Login failed';
      setError(errorMessage);
    },
  });

  const login = (data: LoginData) => {
    const sanitizedData = {
      ...data,
      username: data.username.trim().toLowerCase()
    };
    mutation.mutate(sanitizedData);
  };

  return {
    login,
    error,
    isLoading: mutation.isPending,
  };
};