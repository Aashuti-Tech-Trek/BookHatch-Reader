
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

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

const phoneSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

const codeSchema = z.object({
  code: z.string().min(6, { message: "Verification code must be 6 digits." }),
});

export function AuthForm() {
  const router = useRouter();
  const { 
    signUp, 
    signIn, 
    signInWithGoogle, 
    signInWithPhone, 
    verifyCode 
  } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [authMethod, setAuthMethod] = useState<"email-login" | "email-signup" | "phone" | "main">("main");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);


  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        await signIn(data.email, data.password);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        router.push("/");
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
        router.push("/");
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
        router.push("/");
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
  
  const handlePhoneSignIn = (data: z.infer<typeof phoneSchema>) => {
     startTransition(async () => {
      try {
        const result = await signInWithPhone(data.phone, "recaptcha-container");
        setConfirmationResult(result);
        toast({
          title: "Verification Code Sent",
          description: "Please check your phone for the code.",
        });
      } catch (error: any) {
         toast({
          variant: "destructive",
          title: "Phone Sign-In Failed",
          description: error.message || "Could not send verification code.",
        });
      }
    });
  };
  
  const handleVerifyCode = (data: z.infer<typeof codeSchema>) => {
    if (!confirmationResult) {
       toast({
          variant: "destructive",
          title: "Verification Error",
          description: "No confirmation result found. Please try sending the code again.",
        });
        return;
    }
     startTransition(async () => {
      try {
        await verifyCode(confirmationResult, data.code);
        toast({
          title: "Login Successful",
          description: "Welcome! You are now logged in.",
        });
        router.push("/");
        router.refresh();
      } catch (error: any) {
         toast({
          variant: "destructive",
          title: "Verification Failed",
          description: error.message || "The verification code is invalid.",
        });
      }
    });
  }
  
  const renderMainOptions = () => (
    <div className="space-y-4">
        <Button variant="outline" className="w-full" onClick={() => setAuthMethod("email-login")}>Sign In with Email</Button>
        <Button variant="outline" className="w-full" onClick={() => setAuthMethod("email-signup")}>Create Account with Email</Button>
         <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                Or
                </span>
            </div>
        </div>
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
        <Button variant="outline" className="w-full" onClick={() => setAuthMethod("phone")} disabled={isPending}>
            Continue with Phone Number
        </Button>
        <div id="recaptcha-container"></div>
    </div>
  )

  const renderEmailLogin = () => (
     <div className="space-y-4">
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
        <Button variant="link" onClick={() => setAuthMethod("main")}>Back to all options</Button>
     </div>
  )

  const renderEmailSignup = () => (
    <div className="space-y-4">
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
         <Button variant="link" onClick={() => setAuthMethod("main")}>Back to all options</Button>
    </div>
  )

  const renderPhoneAuth = () => (
     <div className="space-y-4">
        {!confirmationResult ? (
            <form className="space-y-4" onSubmit={phoneForm.handleSubmit(handlePhoneSignIn)}>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 123 456 7890" {...phoneForm.register("phone")} />
                {phoneForm.formState.errors.phone && <p className="text-sm text-destructive">{phoneForm.formState.errors.phone.message}</p>}
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Verification Code
                </Button>
            </form>
        ) : (
            <form className="space-y-4" onSubmit={codeForm.handleSubmit(handleVerifyCode)}>
                <Label htmlFor="code">Verification Code</Label>
                <Input id="code" type="text" placeholder="123456" {...codeForm.register("code")} />
                {codeForm.formState.errors.code && <p className="text-sm text-destructive">{codeForm.formState.errors.code.message}</p>}
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify & Sign In
                </Button>
            </form>
        )}
            <Button variant="link" onClick={() => { setAuthMethod("main"); setConfirmationResult(null); }}>
            Back to all options
        </Button>
    </div>
  )


  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>Sign in or create an account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {authMethod === 'main' && renderMainOptions()}
        {authMethod === 'email-login' && renderEmailLogin()}
        {authMethod === 'email-signup' && renderEmailSignup()}
        {authMethod === 'phone' && renderPhoneAuth()}
      </CardContent>
    </Card>
  );
}
