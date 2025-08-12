
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { genres, type Book } from "@/lib/data";
import { Badge } from "./ui/badge";
import { useState, useId } from "react";
import { BookUp } from "lucide-react";

export function NewStoryForm() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const handleGenreToggle = (genre: string) => {
        setSelectedGenres(prev => 
            prev.includes(genre) ? prev.filter(g => g !== genre) : [genre] // Only allow one genre for simplicity
        )
    }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This object is temporarily stored to pass data to the edit page.
    const newStory: Omit<Book, 'id' | 'slug'> & { genre: string } = {
      title: title || "Untitled Story",
      author: 'Alex Doe', // Placeholder author
      description: summary,
      longDescription: 'Start writing your story here.',
      coverImage: 'https://placehold.co/300x450.png',
      genre: selectedGenres[0] || 'Fantasy'
    };

    // Use localStorage to pass the initial data to the new story page.
    // A real app would send this to a server and get back a new story ID/slug.
    localStorage.setItem('new-story-creation', JSON.stringify(newStory));

    router.push(`/stories/new/edit`);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-semibold">Story Title</Label>
            <Input id="title" placeholder="e.g., The Last Starlight" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-lg font-semibold">Summary</Label>
            <Textarea id="summary" placeholder="A brief, enticing summary of your story." required value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
           <div className="space-y-2">
            <Label className="text-lg font-semibold">Genre(s)</Label>
             <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                    <Badge 
                        key={genre}
                        variant={selectedGenres.includes(genre) ? "default" : "outline"}
                        onClick={() => handleGenreToggle(genre)}
                        className="cursor-pointer"
                    >
                        {genre}
                    </Badge>
                ))}
             </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-lg font-semibold">Keywords / Tropes</Label>
            <Input id="keywords" placeholder="e.g., space opera, found family, enemies to lovers" />
            <p className="text-sm text-muted-foreground">Separate keywords with commas.</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="is-mature" className="font-semibold">Mature Content (18+)</Label>
                <p className="text-sm text-muted-foreground">
                    Does your story contain mature themes or explicit content?
                </p>
              </div>
            <Switch id="is-mature" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" size="lg">
            <BookUp className="mr-2 h-5 w-5" />
            Create Story & Add Chapters
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

    