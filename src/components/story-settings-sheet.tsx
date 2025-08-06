
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type Book, genres } from "@/lib/data";
import { Badge } from "./ui/badge";

interface StorySettingsSheetProps {
  children: React.ReactNode;
  story: Book;
  onStoryUpdate: (updatedStory: { title: string, genre: string, description: string, longDescription: string, keywords: string }) => void;
}

export function StorySettingsSheet({ children, story, onStoryUpdate }: StorySettingsSheetProps) {
  const [title, setTitle] = useState(story.title);
  const [genre, setGenre] = useState(story.genre);
  const [summary, setSummary] = useState(story.description);
  const [longDescription, setLongDescription] = useState(story.longDescription);
  const [keywords, setKeywords] = useState(""); // Assuming keywords are not in the initial book model
  const [selectedGenres, setSelectedGenres] = useState<string[]>([story.genre]);


  useEffect(() => {
    setTitle(story.title);
    setGenre(story.genre);
    setSummary(story.description);
    setLongDescription(story.longDescription)
    setSelectedGenres([story.genre]);
  }, [story]);
  
  const handleGenreToggle = (genreToToggle: string) => {
    setSelectedGenres(prev => 
        prev.includes(genreToToggle) ? prev.filter(g => g !== genreToToggle) : [...prev, genreToToggle]
    )
  }

  const handleSaveChanges = () => {
    // For simplicity, we'll just use the first selected genre. A real app might support multiple.
    const primaryGenre = selectedGenres[0] || story.genre;

    onStoryUpdate({
      title,
      genre: primaryGenre,
      description: summary,
      longDescription,
      keywords,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Story Settings</SheetTitle>
          <SheetDescription>
            Manage your story's details here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
            <div className="space-y-2">
            <Label>Genre(s)</Label>
             <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                    <Badge 
                        key={g}
                        variant={selectedGenres.includes(g) ? "default" : "outline"}
                        onClick={() => handleGenreToggle(g)}
                        className="cursor-pointer"
                    >
                        {g}
                    </Badge>
                ))}
             </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords / Tropes</Label>
            <Input id="keywords" placeholder="e.g., space opera, found family" onChange={(e) => setKeywords(e.target.value)} />
            <p className="text-sm text-muted-foreground">Separate keywords with commas.</p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
