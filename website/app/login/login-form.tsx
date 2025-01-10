'use client'

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useLogin } from "../../hooks/auth/use-login";

const loginFormSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, error, isLoading } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onClickLogin = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <Card className="flex flex-col items-center gap-5 p-6 w-72 md:w-96 shadow-xl">
      <div className="text-2xl">ChatBot App</div>
      <div className="text-md">Login</div>

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onClickLogin)} 
          className="w-full space-y-6"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isLoading) {
              e.preventDefault();
            }
          }}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Username" 
                    {...field} 
                    disabled={isLoading}
                  />
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
                  <Input 
                    placeholder="Password" 
                    type="password" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full m-0" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/sign-up')} 
            className="w-full m-0"
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </form>
      </Form>

      {error && 
        <div className="text-red-500 text-sm rounded-md p-2 bg-red-50">
          {error}
        </div>
      }
    </Card>
  );
}