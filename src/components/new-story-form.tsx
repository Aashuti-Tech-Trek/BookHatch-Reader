
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { genres } from "@/lib/data";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { BookUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function NewStoryForm() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');

    const handleGenreToggle = (genre: string) => {
        setSelectedGenre(genre);
    }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to create a story."});
        router.push('/login');
        return;
    }

    if (!title || !summary || !selectedGenre) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please fill out the title, summary, and select a genre."});
        return;
    }
    
    const newStoryData = {
      title,
      summary,
      genre: selectedGenre
    };

    localStorage.setItem('new-story-creation', JSON.stringify(newStoryData));
    router.push(`/stories/new/edit`);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-semibold">Story Title</Label>
            <Input id="title" placeholder="e.g., The Last Starlight" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-lg font-semibold">Summary</Label>
            <Textarea id="summary" placeholder="A brief, enticing summary of your story." value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
           <div className="space-y-2">
            <Label className="text-lg font-semibold">Genre</Label>
             <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                    <Badge 
                        key={genre}
                        variant={selectedGenre === genre ? "default" : "outline"}
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
