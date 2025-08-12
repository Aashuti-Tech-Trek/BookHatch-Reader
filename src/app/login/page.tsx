
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">
              BookHatch Reader
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-8">
        <div className="text-center mb-8 max-w-md mx-auto">
          <h1 className="text-4xl font-bold font-headline">Welcome</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Sign in or create an account to continue.
          </p>
        </div>
        <AuthForm />
      </main>
    </div>
  );
}
