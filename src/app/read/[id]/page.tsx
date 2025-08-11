
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { books, type Book } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, MessageSquare, PanelLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Chapter {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
}

export default function ReadStoryPage() {
  const params = useParams();
  const storyId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [story, setStory] = useState<Book | undefined>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let initialStory: Book | undefined;
    let initialChapters: Chapter[] = [];

    const savedStory = localStorage.getItem(`story-${storyId}`);
    const savedChapters = localStorage.getItem(`chapters-${storyId}`);

    if (savedStory && savedChapters) {
      initialStory = JSON.parse(savedStory);
      initialChapters = JSON.parse(savedChapters).filter((c: Chapter) => c.isPublished);
    } else {
      const foundStory = books.find((b) => b.id === storyId);
      if (foundStory) {
        initialStory = foundStory;
        // Placeholder chapters if nothing is in local storage
        initialChapters = [
          { id: "chapter-1", title: "The Discovery", content: "<p>This is the content for chapter 1. Readers can comment on this.</p><p>This is another paragraph in the first chapter.</p>", isPublished: true },
          { id: "chapter-2", title: "A Fateful Encounter", content: "<p>Content for chapter 2 comes here.</p>", isPublished: true },
        ];
      }
    }

    if (initialStory) {
      setStory(initialStory);
      setChapters(initialChapters);
      if (initialChapters.length > 0) {
        setActiveChapterId(initialChapters[0].id);
      }
    }
  }, [storyId]);

  if (!isMounted) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p>Loading Story...</p></div>;
  }

  if (!story) {
    return notFound();
  }

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  const ChapterList = () => (
     <nav className="flex flex-col gap-1 p-4">
        <h3 className="font-bold font-headline text-lg mb-2">{story.title}</h3>
        {chapters.map((chapter, index) => (
          <Button
            key={chapter.id}
            variant={activeChapterId === chapter.id ? "secondary" : "ghost"}
            className="justify-start"
            onClick={() => setActiveChapterId(chapter.id)}
          >
            {`Chapter ${index + 1}: ${chapter.title}`}
          </Button>
        ))}
      </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
             <Button asChild variant="ghost" size="icon">
                <Link href={`/books/${story.id}`}>
                    <ArrowLeft />
                    <span className="sr-only">Back to Story Details</span>
                </Link>
            </Button>
            <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold inline-block font-headline">BookHatch Reader</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                        <PanelLeft />
                        <span className="sr-only">Toggle Chapters</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                   <ChapterList />
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <div className="container mx-auto">
        <div className="flex">
            <aside className="hidden lg:block w-1/4 xl:w-1/5 py-8 pr-8 border-r">
                <ChapterList />
            </aside>
            <main className="w-full lg:w-3/4 xl:w-4/5 lg:pl-8 py-8">
                {activeChapter ? (
                    <article className="prose dark:prose-invert max-w-none">
                        <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
                             <Image
                                src={story.coverImage}
                                alt={`Cover of ${story.title}`}
                                fill
                                className="object-cover"
                                data-ai-hint={`${story.genre} book landscape`}
                            />
                        </div>
                        <h1>{activeChapter.title}</h1>
                        <div
                            className="space-y-4"
                            dangerouslySetInnerHTML={{
                                __html: activeChapter.content.replace(/<p>/g, '<p class="group relative">').replace(/<\/p>/g, '<button class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></button></p>')
                            }}
                        />
                    </article>
                ) : (
                    <div className="text-center p-12">
                        <p className="text-muted-foreground">This story has no published chapters yet.</p>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
}
