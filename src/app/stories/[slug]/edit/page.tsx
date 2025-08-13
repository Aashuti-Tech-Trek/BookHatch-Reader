
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { type Book } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Settings,
  Eye,
  EyeOff,
  Loader2
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
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, writeBatch, query, where, orderBy, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const ChapterListDnd = dynamic(() => import('@/components/chapter-list-dnd'), { ssr: false });

export interface Chapter {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
    order: number;
}

export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const storySlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [story, setStory] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const fetchStoryData = useCallback(async (slug: string) => {
    if (!authUser) return;
    setLoading(true);

    const storiesRef = collection(db, 'stories');
    const q = query(storiesRef, where('slug', '==', slug), where('authorId', '==', authUser.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast({ variant: "destructive", title: "Error", description: "Story not found or you don't have permission to edit it." });
      router.push('/profile');
      return;
    }

    const storyDoc = querySnapshot.docs[0];
    setStory({ id: storyDoc.id, ...storyDoc.data() } as Book);

    const chaptersRef = collection(db, `stories/${storyDoc.id}/chapters`);
    const chaptersQuery = query(chaptersRef, orderBy('order'));
    const chaptersSnapshot = await getDocs(chaptersQuery);
    const fetchedChapters = chaptersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chapter));
    
    setChapters(fetchedChapters);
    if (fetchedChapters.length > 0) {
      setActiveChapterId(fetchedChapters[0].id);
    }
    setLoading(false);
  }, [authUser, router, toast]);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      router.push('/login');
      return;
    }
    if (storySlug !== 'new') {
      fetchStoryData(storySlug);
    } else {
        const newStoryData = localStorage.getItem('new-story-creation');
        if (newStoryData) {
            const parsedData = JSON.parse(newStoryData);
            const newStory: Book = {
                id: 'new-story-placeholder', // This will be replaced on first save
                slug: parsedData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
                title: parsedData.title,
                author: authUser.displayName || 'Anonymous',
                authorId: authUser.uid,
                description: parsedData.summary,
                longDescription: 'Start writing your story here.',
                coverImage: 'https://placehold.co/300x450.png',
                genre: parsedData.genre,
                isPublished: false,
            };
            setStory(newStory);
            localStorage.removeItem('new-story-creation');
        } else {
             // Fallback if the user lands on /new/edit directly
            const newStory: Book = {
              id: 'new-story-placeholder',
              slug: 'untitled-story',
              title: 'Untitled Story',
              author: authUser.displayName || 'Anonymous',
              authorId: authUser.uid,
              description: '',
              longDescription: '',
              coverImage: 'https://placehold.co/300x450.png',
              genre: 'Fantasy',
              isPublished: false,
            };
            setStory(newStory);
        }
        setChapters([]);
        setLoading(false);
    }
  }, [storySlug, authLoading, authUser, router, fetchStoryData]);

  const handleSaveDraft = useCallback(async () => {
    if (!story || !authUser) return;
    setSaveState("saving");

    let currentStory = { ...story };

    try {
        if (currentStory.id === 'new-story-placeholder') {
            const newDocRef = doc(collection(db, 'stories'));
            currentStory.id = newDocRef.id; 
            currentStory.authorId = authUser.uid;
            await setDoc(newDocRef, currentStory);
            setStory(currentStory); // Update state with real ID
            router.replace(`/stories/${currentStory.slug}/edit`, { scroll: false });
        } else {
            const storyRef = doc(db, 'stories', story.id);
            await updateDoc(storyRef, currentStory);
        }

        const batch = writeBatch(db);
        chapters.forEach(chapter => {
            const chapterRef = doc(db, `stories/${currentStory.id}/chapters`, chapter.id);
            batch.set(chapterRef, chapter);
        });
        await batch.commit();

        setSaveState("saved");
        toast({ title: "Draft Saved!", description: "Your story and chapters have been saved." });
        setTimeout(() => setSaveState("idle"), 2000);
    } catch (error) {
        console.error("Error saving draft:", error);
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save your story. Please try again." });
        setSaveState("idle");
    }
}, [story, chapters, authUser, router, toast]);

  
  const handleAddChapter = () => {
    const newOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.order)) + 1 : 0;
    const newId = uuidv4();
    const newChapter: Chapter = { id: newId, title: `New Chapter`, content: "<p></p>", isPublished: false, order: newOrder };
    setChapters([...chapters, newChapter]);
    setActiveChapterId(newId);
  };

  const handleDeleteChapter = async (id: string) => {
    if (!story || story.id === 'new-story-placeholder') {
        // If it's a new story, just remove from local state
        setChapters(chapters.filter(chapter => chapter.id !== id));
        if (activeChapterId === id) {
            setActiveChapterId(chapters.length > 1 ? chapters.filter(c => c.id !== id)[0].id : null);
        }
        return;
    }
    try {
        await deleteDoc(doc(db, `stories/${story.id}/chapters`, id));
        const updatedChapters = chapters.filter(chapter => chapter.id !== id);
        setChapters(updatedChapters);
        if (activeChapterId === id) {
            setActiveChapterId(updatedChapters.length > 0 ? updatedChapters[0].id : null);
        }
        toast({ title: "Chapter Deleted" });
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete chapter." });
    }
  };
  
  const handleChapterContentChange = (id: string, newContent: string) => {
    setChapters(chapters.map(chapter =>
        chapter.id === id ? { ...chapter, content: newContent } : chapter
    ));
    setSaveState("idle");
  };

  const handleTogglePublish = (id: string) => {
     setChapters(chapters.map(chapter => 
        chapter.id === id ? { ...chapter, isPublished: !chapter.isPublished } : chapter
    ));
    setSaveState("idle");
  }
  
   const handleStoryUpdate = (updatedStoryData: Partial<Book>) => {
    if (!story) return;
    const newSlug = updatedStoryData.title 
        ? updatedStoryData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') 
        : story.slug;

    setStory(prev => ({ ...prev!, ...updatedStoryData, slug: newSlug }));

    if (story.slug !== 'new' && newSlug !== story.slug) {
        router.replace(`/stories/${newSlug}/edit`, { scroll: false });
    }
    setSaveState("idle");
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedChapters = items.map((chapter, index) => ({ ...chapter, order: index }));
    setChapters(updatedChapters);
    setSaveState("idle");
  };
  
  const handlePublishAll = async () => {
    if (!story || story.id === 'new-story-placeholder' || chapters.length === 0) {
        toast({ variant: "destructive", title: "Cannot Publish", description: "Please save the story and add at least one chapter before publishing."});
        return;
    }
    
    setSaveState("saving");
    try {
        const batch = writeBatch(db);
        chapters.forEach(chapter => {
            const chapterRef = doc(db, `stories/${story.id}/chapters`, chapter.id);
            batch.update(chapterRef, { isPublished: true });
        });
        
        const storyRef = doc(db, "stories", story.id);
        batch.update(storyRef, { isPublished: true });
        
        await batch.commit();
        
        setChapters(prev => prev.map(c => ({ ...c, isPublished: true })));
        setStory(prev => ({ ...prev!, isPublished: true }));

        setSaveState("saved");
        toast({ title: "Story Published!", description: "Your story is now live for everyone to read." });
        router.push(`/books/${story.slug}`);

    } catch (error) {
        console.error("Error publishing story:", error);
        toast({ variant: "destructive", title: "Publish Failed", description: "Could not publish your story. Please try again." });
        setSaveState("idle");
    }
  };

  if (loading || authLoading) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }
  
  if (!story) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <p>Story not found or you do not have access.</p>
        </div>
    );
  }

  const activeChapter = chapters.find(c => c.id === activeChapterId);
  const isStoryPublished = story.isPublished || (chapters.length > 0 && chapters.every(c => c.isPublished));

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
             <Button onClick={handlePublishAll} disabled={story.slug === 'new' || saveState === 'saving'}>Publish Story</Button>
            <Button variant="secondary" onClick={handleSaveDraft} disabled={saveState === 'saving' || saveState === 'saved'}>
                {saveState === 'saving' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : saveState === 'saved' ? 'Saved!' : 'Save Draft'}
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
                                    setChapters(chapters.map(c => c.id === activeChapter.id ? {...c, title: newTitle} : c));
                                    setSaveState('idle');
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
