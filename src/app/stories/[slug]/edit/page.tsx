

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { books, type Book } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { StoryEditor } from "@/components/story-editor";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StorySettingsSheet } from "@/components/story-settings-sheet";
import { Input } from "@/components/ui/input";
import { type DropResult } from 'react-beautiful-dnd';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';

const ChapterListDnd = dynamic(() => import('@/components/chapter-list-dnd'), { ssr: false });

export interface Chapter {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
}

export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  const storySlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [story, setStory] = useState<Book | undefined>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving">("idle");


  // Load initial data from localStorage or fallback to mock data
  useEffect(() => {
    setIsMounted(true);
    let initialStory: Book | undefined;
    let initialChapters: Chapter[] = [];
    
    // The slug is the source of truth from the URL
    const isNewStory = storySlug === 'new';

    if (isNewStory) {
      const newStoryData = localStorage.getItem('new-story-creation');
      if(newStoryData) {
        initialStory = JSON.parse(newStoryData);
        // Ensure the slug is 'new' to match the URL state
        initialStory!.slug = 'new';
        // Assign a placeholder ID for local storage consistency
        initialStory!.id = 'new-story-placeholder';
      } else {
         // Fallback if the user lands on /new/edit directly
         initialStory = {
          id: 'new-story-placeholder',
          slug: 'new',
          title: 'Untitled Story',
          author: 'Alex Doe',
          description: '',
          longDescription: '',
          coverImage: 'https://placehold.co/300x450.png',
          genre: 'Fantasy'
        };
      }
      initialChapters = [];
    } else {
      // Find the story from the `books` array by slug
      const foundStory = books.find((b) => b.slug === storySlug);
      
      const savedStoryData = localStorage.getItem(`story-${storySlug}`);
      const savedChaptersData = localStorage.getItem(`chapters-${storySlug}`);
      
      if (savedStoryData) {
        initialStory = JSON.parse(savedStoryData);
      } else {
        initialStory = foundStory;
      }

      if(savedChaptersData) {
        initialChapters = JSON.parse(savedChaptersData);
      } else if (foundStory) {
        // Placeholder chapters for first-time load if nothing is in storage
         initialChapters = [
          { id: "chapter-1", title: "The Discovery", content: "<p>This is the content for chapter 1.</p>", isPublished: true },
          { id: "chapter-2", title: "A Fateful Encounter", content: "<p>Content for chapter 2 comes here.</p>", isPublished: true },
          { id: "chapter-3", title: "Whispers in the Dark", content: "<p>And finally, chapter 3 content.</p>", isPublished: false },
        ];
      }
    }
    
    setStory(initialStory);
    setChapters(initialChapters);
    if(initialChapters.length > 0) {
      setActiveChapterId(initialChapters[0]?.id ?? null);
    }
  }, [storySlug]);
  
  // Save story to localStorage whenever it changes
  useEffect(() => {
    if (story && isMounted) {
      const key = story.slug === 'new' ? 'new-story-creation' : `story-${story.slug}`;
      localStorage.setItem(key, JSON.stringify(story));
    }
  }, [story, isMounted]);

  // Save chapters to localStorage whenever they change
  useEffect(() => {
    if (story && story.slug !== 'new' && isMounted) {
       if (chapters.length > 0) {
           localStorage.setItem(`chapters-${story.slug}`, JSON.stringify(chapters));
       } else {
           localStorage.removeItem(`chapters-${story.slug}`);
       }
    }
  }, [chapters, story, isMounted]);


  if (!isMounted) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <p>Loading Editor...</p>
        </div>
    );
  }
  
  if (!story) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <p>Story not found...</p>
        </div>
    );
  }
  
  const handleAddChapter = () => {
    const newId = uuidv4();
    const newChapter: Chapter = { id: newId, title: `New Chapter`, content: "<p></p>", isPublished: false };
    setChapters([...chapters, newChapter]);
    setActiveChapterId(newId);
  };

  const handleDeleteChapter = (id: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== id));
    if (activeChapterId === id) {
        setActiveChapterId(chapters.length > 1 ? chapters.filter(c => c.id !== id)[0].id : null);
    }
  };
  
  const handleChapterContentChange = (id: string, newContent: string) => {
    setChapters(chapters.map(chapter =>
        chapter.id === id ? { ...chapter, content: newContent } : chapter
    ));
  };

  const handleTogglePublish = (id: string) => {
     setChapters(chapters.map(chapter => 
        chapter.id === id ? { ...chapter, isPublished: !chapter.isPublished } : chapter
    ));
  }
  
   const handleStoryUpdate = (updatedStory: Partial<Book>) => {
    setStory(prevStory => {
      if (!prevStory) return undefined;
      const newSlug = updatedStory.title ? updatedStory.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : prevStory.slug;
      
      const isNewStoryFlow = prevStory.id === 'new-story-placeholder';
      const slugHasChanged = newSlug !== prevStory.slug;

      const finalStory = { ...prevStory, ...updatedStory, slug: newSlug };

      if (isNewStoryFlow && slugHasChanged) {
         // This is the first *real* save for a new story.
         // Give it a real ID and remove the placeholder data.
         finalStory.id = newSlug; // Use the slug as the ID
         localStorage.setItem(`story-${newSlug}`, JSON.stringify(finalStory));
         localStorage.removeItem('new-story-creation'); 
         
         // Update the URL to match the new slug without reloading the page
         router.replace(`/stories/${newSlug}/edit`);
      } else if (slugHasChanged) {
        // The slug has changed for an existing story. We need to migrate the data.
        localStorage.setItem(`story-${newSlug}`, JSON.stringify(finalStory));
        localStorage.setItem(`chapters-${newSlug}`, JSON.stringify(chapters));
        
        // Clean up the old slug data
        localStorage.removeItem(`story-${prevStory.slug}`);
        localStorage.removeItem(`chapters-${prevStory.slug}`);
        
        router.replace(`/stories/${newSlug}/edit`);
      }
      
      return finalStory;
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChapters(items);
  };
  
  const handlePublishAll = () => {
    setChapters(chapters.map(chapter => ({ ...chapter, isPublished: true })));
    // Redirect to the main story page after publishing
    router.push(`/books/${story.slug}`);
  };

  const handleSaveDraft = () => {
    setSaveState("saving");
    // The useEffects already handle saving, so this is for UX feedback.
    // In a real app, this would trigger an API call.
    setTimeout(() => {
      setSaveState("idle");
    }, 1500);
  };

  const activeChapter = chapters.find(c => c.id === activeChapterId);
  const isStoryPublished = chapters.length > 0 && chapters.every(c => c.isPublished);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">
              BookHatch Writer
            </span>
          </Link>
          <div className="flex items-center gap-4">
             <Button onClick={handlePublishAll} disabled={story.slug === 'new'}>Publish All</Button>
            <Button variant="secondary" onClick={handleSaveDraft} disabled={saveState === 'saving'}>
                {saveState === 'saving' ? 'Saved!' : 'Save Draft'}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Stories
          </Link>
        </Button>
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
             <Card>
                <CardHeader>
                     <div className="aspect-[2/3] w-full overflow-hidden rounded-md">
                        <Image
                            src={story.coverImage}
                            alt={`Cover of ${story.title}`}
                            width={300}
                            height={450}
                            className="w-full h-full object-cover"
                            data-ai-hint={`${story.genre} book`}
                        />
                    </div>
                </CardHeader>
                 <CardContent>
                    <h2 className="text-xl font-bold font-headline">{story.title}</h2>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary">{story.genre}</Badge>
                         <Badge variant={isStoryPublished ? "default" : "outline"}>
                           {isStoryPublished ? "Published" : "Draft"}
                         </Badge>
                    </div>
                 </CardContent>
                 <CardFooter>
                    <StorySettingsSheet story={story} onStoryUpdate={handleStoryUpdate}>
                        <Button variant="outline" className="w-full">
                            <Settings className="mr-2 h-4 w-4" />
                            Story Settings
                        </Button>
                    </StorySettingsSheet>
                 </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 p-0">
                  <ChapterListDnd 
                    chapters={chapters}
                    activeChapterId={activeChapterId}
                    onDragEnd={onDragEnd}
                    setActiveChapterId={setActiveChapterId}
                    handleTogglePublish={handleTogglePublish}
                    handleDeleteChapter={handleDeleteChapter}
                  />
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleAddChapter}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Chapter
                    </Button>
                </CardFooter>
            </Card>
          </aside>
          <div className="lg:col-span-3">
            <Card>
                {activeChapter ? (
                    <>
                        <CardHeader>
                            <Input 
                                type="text" 
                                value={activeChapter.title}
                                onChange={(e) => {
                                    const newTitle = e.target.value;
                                    setChapters(chapters.map(c => c.id === activeChapter.id ? {...c, title: newTitle} : c))
                                }}
                                className="text-3xl font-bold font-headline bg-transparent border-none focus:ring-0 p-0 w-full h-auto" 
                            />
                        </CardHeader>
                        <Separator />
                        <CardContent className="p-0">
                            <StoryEditor 
                                content={activeChapter.content}
                                onChange={(newContent) => handleChapterContentChange(activeChapter.id, newContent)}
                            />
                        </CardContent>
                    </>
                ) : (
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">Select a chapter to start editing or add a new one.</p>
                    </CardContent>
                )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

    
