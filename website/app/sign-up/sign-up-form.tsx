'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { useRouter } from 'next/navigation';
import { useSignUp } from "../../hooks/auth/use-sign-up";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Must be at least 3 characters.",
  }).max(50, {
    message: "Must be at most 50 characters.",
  }),
  password: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { signUp, error, isLoading } = useSignUp();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onClickSignUp = (data: FormValues) => {
    signUp(data);
  };

  return (
    <Card className="flex flex-col items-center gap-5 p-6 w-72 md:w-96">
      <div className="text-2xl">ChatBot App</div>
      <div className="text-md">Sign Up</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onClickSignUp)} className="w-full space-y-6">
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
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>

          <Button
            type="button"
            variant="link"
            onClick={() => router.push('/login')}
            className="w-full m-0"
            disabled={isLoading}
          >
            Back
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