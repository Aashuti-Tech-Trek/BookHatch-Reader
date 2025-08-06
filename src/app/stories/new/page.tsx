
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NewStoryForm } from "@/components/new-story-form";

export default function NewStoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">BookHatch Writer</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-8">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Profile
          </Link>
        </Button>
         <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
              <h1 className="text-4xl font-bold font-headline">Create a New Story</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Fill in the details below to start your next masterpiece.
              </p>
          </div>
          <NewStoryForm />
        </div>
      </main>
    </div>
  );
}
