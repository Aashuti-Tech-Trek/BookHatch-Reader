
"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { books } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Settings,
  Trash2,
  FileText,
  GripVertical
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { StoryEditor } from "@/components/story-editor";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function EditStoryPage({ params }: { params: { id: string } }) {
  const story = books.find((b) => b.id === params.id);

  if (!story) {
    // In a real app, this might be a new story, but for now we'll use existing data
    notFound();
  }

  // Placeholder chapters
  const chapters = [
    { id: 1, title: "The Discovery" },
    { id: 2, title: "A Fateful Encounter" },
    { id: 3, title: "Whispers in the Dark" },
  ];

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
            <Button>Publish</Button>
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
                         <Badge variant="outline">WIP</Badge>
                    </div>
                 </CardContent>
                 <CardFooter>
                     <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Story Settings
                     </Button>
                 </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {chapters.map(chapter => (
                        <div key={chapter.id} className="group flex items-center justify-between p-2 rounded-md hover:bg-muted">
                            <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <FileText className="h-4 w-4" />
                                <span>{chapter.title}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Chapter
                    </Button>
                </CardFooter>
            </Card>

          </aside>
          <div className="lg:col-span-3">
            <Card>
                <CardHeader>
                    <input type="text" defaultValue="Chapter 1: The Discovery" className="text-3xl font-bold font-headline bg-transparent border-none focus:ring-0 p-0 w-full" />
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                    <StoryEditor />
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
