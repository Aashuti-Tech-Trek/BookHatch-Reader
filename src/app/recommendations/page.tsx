
"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft, Search } from "lucide-react";
import { RecommendationsForm } from "@/components/recommendations-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export default function RecommendationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get('q') || '';

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

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
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              defaultValue={defaultQuery}
              placeholder="Search for books, authors, or genres..."
              className="w-full pl-10 pr-4 py-2 text-lg rounded-full"
            />
        </form>
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
