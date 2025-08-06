"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { genres } from "@/lib/data";
import { getRecommendations } from "@/lib/actions/recommendations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const FormSchema = z.object({
  genres: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one genre.",
  }),
});

export function RecommendationsForm() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      genres: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setRecommendations([]);
    try {
      const result = await getRecommendations(data.genres);
      if (result.recommendations) {
        setRecommendations(result.recommendations);
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="genres"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base font-bold">Genres</FormLabel>
                      <FormDescription>
                        Select one or more genres to get personalized recommendations.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {genres.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="genres"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center p-8">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground text-lg">Our AI is searching for your perfect books...</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-6 font-headline">
            Your Personal Reading List
          </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((rec, index) => {
              // Extract title and author. Assumes format "1. Title by Author"
              const match = rec.match(/(\d+\.\s*)?(.*?)(\s+by\s+(.*))?$/);
              const title = match ? match[2] : rec;
              const author = match ? match[4] : 'Unknown Author';

              return (
                <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-0">
                         <div className="aspect-[2/3] w-full bg-muted">
                            <Image
                                src={`https://placehold.co/300x450.png`}
                                alt={`Cover of ${title}`}
                                width={300}
                                height={450}
                                className="w-full h-full object-cover"
                                data-ai-hint="book"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <CardTitle className="font-headline text-lg leading-tight truncate">{title}</CardTitle>
                        <CardDescription className="mt-1 text-sm">{author}</CardDescription>
                    </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}
