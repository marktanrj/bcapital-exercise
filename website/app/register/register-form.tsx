'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';
import { useState } from 'react';
import { useAuthStore } from "../../store/auth-store";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Must be at least 3 characters.",
  }).max(50, {
    message: "Must be at most 50 characters.",
  }),
  password: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: FormValues) => authApi.register(data.username, data.password),
    onSuccess: (data) => {
      setUser(data);
      router.push('/chat');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Registration failed');
    },
  });

  const onClickRegister = (data: FormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <Card className="flex flex-col items-center gap-5 p-6 w-72 md:w-96">
      <div className="text-2xl">ChatBot App</div>
      <div className="text-md">Register</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onClickRegister)} className="w-full space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full m-0">Register</Button>
          <Button type="button" variant="link" onClick={() => router.push('/login')} className="w-full m-0">Back</Button>
          </form>
      </Form>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </Card>
  );
}