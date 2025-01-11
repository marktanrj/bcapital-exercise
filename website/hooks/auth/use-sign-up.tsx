"use client"

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth-api';
import { useAuthStore } from "@/store/auth-store";

type SignUpData = {
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

export const useSignUp = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: (data: SignUpData) => 
      authApi.signUp(data.username, data.password),
    onSuccess: (data) => {
      setUser(data);
      setError('');
      router.push('/chat');
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message ?? 'Sign up failed';
      setError(errorMessage);
    },
  });

  const signUp = (data: SignUpData) => {
    const sanitizedData = {
      ...data,
      username: data.username.trim().toLowerCase()
    };
    mutation.mutate(sanitizedData);
  };

  return {
    signUp,
    error,
    isLoading: mutation.isPending,
  };
};