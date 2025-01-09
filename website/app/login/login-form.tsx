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
import { loginUser } from '../../lib/auth';
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

export function LoginForm() {
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
  
  const loginMutation = useMutation({
    mutationFn: (data: FormValues) => loginUser(data.username, data.password),
    onSuccess: (data) => {
      setUser(data.user);
      router.push('/chat');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Login failed');
    },
  });

  const onClickLogin = (data: FormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="flex flex-col items-center gap-5 p-6 w-72 md:w-96">
      <div className="text-2xl">ChatBot App</div>
      <div className="text-md">Login</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onClickLogin)} className="w-full space-y-6">
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

          <Button type="submit" className="w-full m-0">Login</Button>
          <Button type="button" variant="default" onClick={() => router.push('/register')} className="w-full m-0">Register</Button>
        </form>
      </Form>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </Card>
  );
}