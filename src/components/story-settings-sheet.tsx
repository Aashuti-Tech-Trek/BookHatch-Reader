
"use client";

import { useState, useEffect, ChangeEvent, useTransition } from "react";
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
import Image from "next/image";
import { generateCoverImageAction } from "@/lib/actions/stories";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StorySettingsSheetProps {
  children: React.ReactNode;
  story: Book;
  onStoryUpdate: (updatedStory: Partial<Book>) => void;
}

export function StorySettingsSheet({ children, story, onStoryUpdate }: StorySettingsSheetProps) {
  const [title, setTitle] = useState(story.title);
  const [genre, setGenre] = useState(story.genre);
  const [summary, setSummary] = useState(story.description);
  const [longDescription, setLongDescription] = useState(story.longDescription);
  const [keywords, setKeywords] = useState(""); // Assuming keywords are not in the initial book model
  const [selectedGenres, setSelectedGenres] = useState<string[]>([story.genre]);
  const [coverImage, setCoverImage] = useState(story.coverImage);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [isGenerating, startTransition] = useTransition();
  const { toast } = useToast();


  useEffect(() => {
    setTitle(story.title);
    setGenre(story.genre);
    setSummary(story.description);
    setLongDescription(story.longDescription)
    setSelectedGenres([story.genre]);
    setCoverImage(story.coverImage);
    // Assuming keywords are stored in a property that might not exist on the initial Book type
    // If you add `keywords: string[]` to the Book type, you can set it here.
    // setKeywords(story.keywords?.join(", ") || "");
  }, [story]);
  
  const handleGenreToggle = (genreToToggle: string) => {
    setSelectedGenres(prev => 
        prev.includes(genreToToggle) ? prev.filter(g => g !== genreToToggle) : [...prev, genreToToggle]
    )
  }

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImage(URL.createObjectURL(file));
    }
  };
  
  const handleGenerateCover = () => {
    startTransition(async () => {
      const result = await generateCoverImageAction({
        title,
        genre: selectedGenres[0] || genre,
        summary,
      });

      if (result.imageUrl) {
        setCoverImage(result.imageUrl);
        setCoverImageFile(null); // Unset file if user chose one before generating
        toast({
          title: "Image Generated!",
          description: "A new cover image has been created.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error || "Could not generate an image. Please try again.",
        });
      }
    });
  };


  const handleSaveChanges = () => {
    const primaryGenre = selectedGenres[0] || story.genre;

    onStoryUpdate({
      title,
      genre: primaryGenre,
      description: summary,
      longDescription,
      // In a real app, you would handle keywords as an array
      // keywords: keywords.split(',').map(k => k.trim()),
      coverImage: coverImageFile ? URL.createObjectURL(coverImageFile) : coverImage,
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
            <Label>Cover Image</Label>
            <div className="w-full aspect-[2/3] rounded-md overflow-hidden relative bg-muted flex items-center justify-center">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt="Story Cover"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-sm text-muted-foreground">No Image</span>
              )}
               {isGenerating && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="mt-2">Generating...</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
               <Input 
                id="coverImage" 
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                disabled={isGenerating}
                className="col-span-2"
              />
              <Button
                variant="outline"
                onClick={handleGenerateCover}
                disabled={isGenerating}
                className="col-span-2"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isGenerating}
            />
          </div>
           <div className="space-y-2">
            <Label>Genre(s)</Label>
             <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                    <Badge 
                        key={g}
                        variant={selectedGenres.includes(g) ? "default" : "outline"}
                        onClick={() => !isGenerating && handleGenreToggle(g)}
                        className={cn("cursor-pointer", isGenerating && "cursor-not-allowed opacity-50")}
                    >
                        {g}
                    </Badge>
                ))}
             </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
               disabled={isGenerating}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="longDescription">Full Description</Label>
            <Textarea
              id="longDescription"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              rows={5}
               disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords / Tropes</Label>
            <Input id="keywords" value={keywords} placeholder="e.g., space opera, found family" onChange={(e) => setKeywords(e.target.value)}  disabled={isGenerating} />
            <p className="text-sm text-muted-foreground">Separate keywords with commas.</p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSaveChanges} disabled={isGenerating}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
