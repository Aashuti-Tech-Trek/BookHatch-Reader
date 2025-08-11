
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { books, type Book } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Settings,
  Trash2,
  FileText,
  GripVertical,
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
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';


interface Chapter {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
}

export default function EditStoryPage() {
  const params = useParams();
  const storyId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [story, setStory] = useState<Book | undefined>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load initial data from localStorage or fallback to mock data
  useEffect(() => {
    setIsMounted(true);
    let initialStory: Book | undefined;
    let initialChapters: Chapter[] = [];

    const savedStory = localStorage.getItem(`story-${storyId}`);
    const savedChapters = localStorage.getItem(`chapters-${storyId}`);

    if (savedStory && savedChapters) {
      initialStory = JSON.parse(savedStory);
      initialChapters = JSON.parse(savedChapters);
    } else {
      const foundStory = books.find((b) => b.id === storyId);
      if (foundStory) {
        initialStory = foundStory;
        // Placeholder chapters for first-time load
        initialChapters = [
          { id: "chapter-1", title: "The Discovery", content: "<p>This is the content for chapter 1.</p>", isPublished: true },
          { id: "chapter-2", title: "A Fateful Encounter", content: "<p>Content for chapter 2 comes here.</p>", isPublished: true },
          { id: "chapter-3", title: "Whispers in the Dark", content: "<p>And finally, chapter 3 content.</p>", isPublished: false },
        ];
      } else if (storyId === "new-story-placeholder") {
        initialStory = {
          id: 'new-story-placeholder',
          title: 'Untitled Story',
          author: 'Alex Doe',
          description: 'A new story begins...',
          longDescription: 'Start writing your story here.',
          coverImage: 'https://placehold.co/300x450.png',
          genre: 'Fantasy'
        };
        initialChapters = [];
      }
    }
    
    setStory(initialStory);
    setChapters(initialChapters);
    if(initialChapters.length > 0) {
      setActiveChapterId(initialChapters[0]?.id ?? null);
    }
  }, [storyId]);
  
  // Save story to localStorage whenever it changes
  useEffect(() => {
    if (story && isMounted) {
      localStorage.setItem(`story-${story.id}`, JSON.stringify(story));
    }
  }, [story, isMounted]);

  // Save chapters to localStorage whenever they change
  useEffect(() => {
    if (chapters.length > 0 && storyId && isMounted) {
      localStorage.setItem(`chapters-${storyId}`, JSON.stringify(chapters));
    } else if (isMounted && storyId) {
      // If all chapters are deleted, remove from storage
      localStorage.removeItem(`chapters-${storyId}`);
    }
  }, [chapters, storyId, isMounted]);


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
    const newId = `chapter-${chapters.length > 0 ? Math.max(...chapters.map(c => parseInt(c.id.split('-')[1]))) + 1 : 1}`;
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

  const handleChapterTitleChange = (id: string, newTitle: string) => {
    setChapters(chapters.map(chapter => 
        chapter.id === id ? { ...chapter, title: newTitle } : chapter
    ));
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
      return { ...prevStory, ...updatedStory };
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
            <Button variant="secondary">Preview</Button>
            <Button onClick={handlePublishAll}>Publish All</Button>
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
                <CardContent className="space-y-1">
                  {isMounted && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="chapters">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {chapters.map((chapter, index) => (
                                         <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div 
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={cn(
                                                        "group flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer",
                                                        activeChapterId === chapter.id && "bg-muted",
                                                        snapshot.isDragging && "bg-primary/20 shadow-lg"
                                                    )}
                                                    onClick={() => setActiveChapterId(chapter.id)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                        <FileText className="h-4 w-4 flex-shrink-0" />
                                                        <span className="truncate">{chapter.title}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Badge variant={chapter.isPublished ? "secondary" : "outline"} className="mr-2 h-5">
                                                            {chapter.isPublished ? 'Published' : 'Draft'}
                                                        </Badge>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleTogglePublish(chapter.id);}} title={chapter.isPublished ? "Unpublish" : "Publish"}>
                                                            {chapter.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/70 hover:text-destructive opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id)}}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                  )}
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
                                onChange={(e) => handleChapterTitleChange(activeChapter.id, e.target.value)}
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
