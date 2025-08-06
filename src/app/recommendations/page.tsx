import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { RecommendationsForm } from "@/components/recommendations-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function RecommendationsPage() {
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
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold font-headline">Find Your Next Read</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Select your favorite genres and let our AI find books you'll love.
          </p>
        </div>
        <RecommendationsForm />
      </main>
    </div>
  );
}
