
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof loginSchema>;

export function AuthForm() {
  const router = useRouter();
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleAction = (action: 'signIn' | 'signUp') => (data: FormData) => {
    startTransition(async () => {
      try {
        const method = action === 'signIn' ? signIn : signUp;
        await method(data.email, data.password);
        toast({
          title: action === 'signIn' ? "Login Successful" : "Account Created",
          description: "Welcome! You are now logged in.",
        });
        router.push("/profile");
        router.refresh();
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error.message || "An unexpected error occurred.",
        });
      }
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button type="button" className="w-full" onClick={handleSubmit(handleAction('signIn'))} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={handleSubmit(handleAction('signUp'))} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
