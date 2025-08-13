
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { genres } from "@/lib/data";
import { getRecommendations } from "@/lib/actions/recommendations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Lightbulb, Search, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FilterSchema = z.object({
  searchQuery: z.string().optional(),
  genres: z.array(z.string()).optional(),
  status: z.enum(["all", "published", "ongoing"]).default("all"),
  rating: z.enum(["all", "mature"]).default("all"),
});

type FilterFormValues = z.infer<typeof FilterSchema>;

interface FilterSidebarProps {
  onSearch: (filters: FilterFormValues) => void;
  onGetRecommendations: (recommendations: string[]) => void;
  setLoading: (isLoading: boolean) => void;
}

export function FilterSidebar({ onSearch, onGetRecommendations, setLoading }: FilterSidebarProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRecGenres, setSelectedRecGenres] = useState<string[]>([]);
  
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      searchQuery: "",
      genres: [],
      status: "all",
      rating: "all",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "genres",
  });

  const handleGenreChange = (genre: string) => {
    const genreIndex = form.getValues("genres")?.indexOf(genre);
    if (genreIndex !== undefined && genreIndex > -1) {
      remove(genreIndex);
    } else {
      append(genre);
    }
  };
  
  const handleRecGenreChange = (genre: string) => {
     setSelectedRecGenres(prev => 
        prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
     )
  }

  async function handleGenerateRecommendations() {
    if (selectedRecGenres.length === 0) {
      toast({
        variant: "destructive",
        title: "No Genres Selected",
        description: "Please select at least one genre to get recommendations.",
      });
      return;
    }
    setLoading(true);
    setIsGenerating(true);
    try {
      const result = await getRecommendations(selectedRecGenres);
      if (result.recommendations) {
        onGetRecommendations(result.recommendations);
      } else {
        throw new Error("No recommendations returned.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate recommendations. Please try again.",
      });
       onGetRecommendations([]);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-6 w-6" />
            <span>Discover & Filter</span>
        </CardTitle>
        <CardDescription>
            Refine results or get AI recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSearch)}>
          <div className="space-y-6">
            <Accordion type="multiple" defaultValue={['recommendations', 'genres']} className="w-full">
              <AccordionItem value="recommendations">
                <AccordionTrigger className="text-base font-semibold">AI Recommendations</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <p className="text-sm text-muted-foreground">Select genres to get a custom reading list.</p>
                     <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {genres.map(genre => (
                             <div key={genre} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`rec-${genre}`}
                                    checked={selectedRecGenres.includes(genre)}
                                    onCheckedChange={() => handleRecGenreChange(genre)}
                                />
                                <Label htmlFor={`rec-${genre}`} className="font-normal">{genre}</Label>
                            </div>
                        ))}
                    </div>
                     <Button onClick={handleGenerateRecommendations} disabled={isGenerating} className="w-full">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                        Get Recommendations
                    </Button>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="genres">
                <AccordionTrigger className="text-base font-semibold">Genre</AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
                    {genres.map(genre => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox 
                            id={genre} 
                            onCheckedChange={() => handleGenreChange(genre)}
                            checked={form.watch("genres")?.includes(genre)}
                        />
                        <Label htmlFor={genre} className="font-normal">{genre}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="status">
                <AccordionTrigger className="text-base font-semibold">Story Status</AccordionTrigger>
                <AccordionContent className="pt-2">
                   <RadioGroup
                    onValueChange={(value) => form.setValue("status", value as "all" | "published" | "ongoing")}
                    defaultValue={form.getValues("status")}
                    className="space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="status-all" />
                      <Label htmlFor="status-all" className="font-normal">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="published" id="status-published" />
                      <Label htmlFor="status-published" className="font-normal">Published</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ongoing" id="status-ongoing" />
                      <Label htmlFor="status-ongoing" className="font-normal">Ongoing</Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

               <AccordionItem value="rating">
                <AccordionTrigger className="text-base font-semibold">Content Rating</AccordionTrigger>
                <AccordionContent className="pt-2">
                   <RadioGroup
                     onValueChange={(value) => form.setValue("rating", value as "all" | "mature")}
                    defaultValue={form.getValues("rating")}
                    className="space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="rating-all" />
                      <Label htmlFor="rating-all" className="font-normal">All Ages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mature" id="rating-mature" />
                      <Label htmlFor="rating-mature" className="font-normal">Mature (18+)</Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
            
            <Separator />
            
            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
