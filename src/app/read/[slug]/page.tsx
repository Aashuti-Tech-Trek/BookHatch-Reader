
"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound, useRouter } from "next/navigation";
import { type Book } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, MessageSquare, PanelLeft, Volume2, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { db } from "@/lib/firebase";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { generateChapterAudioAction } from "@/lib/actions/stories";
import { useToast } from "@/hooks/use-toast";

interface Chapter {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
}

export default function ReadStoryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const storySlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [story, setStory] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, startAudioGeneration] = useTransition();

  useEffect(() => {
    setIsMounted(true);
    if (!storySlug) return;

    const fetchStoryAndChapters = async () => {
      const storiesRef = collection(db, "stories");
      const q = query(storiesRef, where("slug", "==", storySlug));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStory(null); // Will trigger notFound() later
        return;
      }

      const storyDoc = querySnapshot.docs[0];
      const storyData = { id: storyDoc.id, ...storyDoc.data() } as Book;
      setStory(storyData);

      const chaptersRef = collection(db, `stories/${storyDoc.id}/chapters`);
      const chaptersQuery = query(chaptersRef, where("isPublished", "==", true), orderBy("order", "asc"));
      const chaptersSnapshot = await getDocs(chaptersQuery);
      const fetchedChapters = chaptersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chapter));
      
      setChapters(fetchedChapters);
      if (fetchedChapters.length > 0) {
        setActiveChapterId(fetchedChapters[0].id);
      }
    };

    fetchStoryAndChapters();
  }, [storySlug]);

  useEffect(() => {
    // Reset audio when chapter changes
    setAudioUrl(null);
  }, [activeChapterId]);

  if (!isMounted) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center"><p>Loading Story...</p></div>;
  }

  if (!story && isMounted) {
    notFound();
  }

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  const handleGenerateAudio = () => {
    if (!activeChapter) return;

    startAudioGeneration(async () => {
      setAudioUrl(null);
      const result = await generateChapterAudioAction(activeChapter.content);
      if (result.audioDataUri) {
        setAudioUrl(result.audioDataUri);
      } else {
        toast({
          variant: 'destructive',
          title: 'Audio Generation Failed',
          description: result.error || 'Could not generate audio for this chapter.',
        });
      }
    });
  };

  const ChapterList = () => (
     <nav className="flex flex-col gap-1 p-4">
        <h3 className="font-bold font-headline text-lg mb-2">{story?.title || "Loading..."}</h3>
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
             <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
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
                {activeChapter && story ? (
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
                        <div className="flex justify-between items-center mb-4">
                          <h1 className="mb-0">{activeChapter.title}</h1>
                           {story.audioNarrationEnabled && (
                            <Button onClick={handleGenerateAudio} disabled={isGeneratingAudio} variant="outline" size="sm">
                                {isGeneratingAudio ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="mr-2 h-4 w-4" />
                                    Listen to Chapter
                                  </>
                                )}
                              </Button>
                           )}
                        </div>
                         {(isGeneratingAudio || audioUrl) && (
                          <div className="my-6">
                            {isGeneratingAudio && <p className="text-muted-foreground text-center">Generating audio, please wait...</p>}
                            {audioUrl && (
                                <audio controls className="w-full">
                                  <source src={audioUrl} type="audio/wav" />
                                  Your browser does not support the audio element.
                                </audio>
                            )}
                          </div>
                        )}
                        <div
                            className="space-y-4"
                            dangerouslySetInnerHTML={{
                                __html: activeChapter.content.replace(/<p>/g, '<p class="group relative">').replace(/<\/p>/g, '<button class="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></button></p>')
                            }}
                        />
                    </article>
                ) : (
                    <div className="text-center p-12">
                        <p className="text-muted-foreground">{story ? "This story has no published chapters yet." : "Loading chapter..."}</p>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
}
