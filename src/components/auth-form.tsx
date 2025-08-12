
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});


export function AuthForm() {
  const router = useRouter();
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("signin");

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        await signIn(data.email, data.password);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
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
  
  const handleSignUp = (data: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
      try {
        await signUp(data.name, data.email, data.password);
        toast({
          title: "Account Created",
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


  const handleGoogleSignIn = () => {
    startTransition(async () => {
      try {
        await signInWithGoogle();
        toast({
          title: "Login Successful",
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
        <CardDescription>Sign in or create an account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isPending}>
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 122.4 109.8 14.2 244 14.2c66.8 0 124 23.3 166.3 60.1l-66.7 64.9C315.1 114.9 283.4 97.6 244 97.6c-85.3 0-154.4 68.4-154.4 152.9s69.1 152.9 154.4 152.9c97.9 0 134-66.2 138.8-100.9H244v-75.3h236.4c2.5 12.9 3.6 26.4 3.6 40.5z"></path>
                </svg>
            )}
            Continue with Google
        </Button>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
                </span>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
                 <form className="space-y-4 pt-4" onSubmit={loginForm.handleSubmit(handleLogin)}>
                    <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" type="email" placeholder="m@example.com" {...loginForm.register("email")} />
                        {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input id="login-password" type="password" {...loginForm.register("password")} />
                         {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </form>
            </TabsContent>
            <TabsContent value="signup">
                 <form className="space-y-4 pt-4" onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" placeholder="Your Name" {...signUpForm.register("name")} />
                        {signUpForm.formState.errors.name && <p className="text-sm text-destructive">{signUpForm.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="m@example.com" {...signUpForm.register("email")} />
                        {signUpForm.formState.errors.email && <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type="password" {...signUpForm.register("password")} />
                        {signUpForm.formState.errors.password && <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                </form>
            </TabsContent>
        </Tabs>

      </CardContent>
    </Card>
  );
}
