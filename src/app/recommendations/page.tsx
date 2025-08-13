
"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft, Search, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useTransition, useCallback } from "react";
import { BookCard } from "@/components/book-card";
import Image from "next/image";
import { FilterSidebar, type FilterValues } from "@/components/filter-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { searchBooks } from "@/lib/actions/search";
import { Book } from "@/lib/data";

export default function RecommendationsPage() {
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isInitialState, setIsInitialState] = useState(true);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Omit<FilterValues, 'searchQuery'>>({});

  const debouncedSearch = useDebouncedCallback((query: string, currentFilters: Omit<FilterValues, 'searchQuery'>) => {
    startTransition(async () => {
      setIsInitialState(false);
      setRecommendations([]); // Clear AI recs when performing a search
      const combinedFilters = { ...currentFilters, searchQuery: query };
      const results = await searchBooks(combinedFilters);
      setSearchResults(results);
    });
  }, 500);

  useEffect(() => {
    // Trigger search when filters from sidebar change or when searchQuery changes
    if (!isInitialState) {
        debouncedSearch(searchQuery, filters);
    }
  }, [searchQuery, filters, isInitialState, debouncedSearch]);


  const handleGetRecommendations = (recs: string[]) => {
    setRecommendations(recs);
    setSearchResults([]); // Clear search results
    setIsInitialState(false);
  };
  
  const handleLoadingState = (isLoading: boolean) => {
     if (isLoading) {
      setIsInitialState(false);
      setRecommendations([]);
      setSearchResults([]);
    }
  }

  const handleFilterChange = useCallback((newFilters: Omit<FilterValues, 'searchQuery'>) => {
    setFilters(newFilters);
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }
  
  const hasActiveFilters = searchQuery || Object.values(filters).some(val => Array.isArray(val) ? val.length > 0 : val && val !== 'all');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">
              BookHatch Reader
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-8">
         <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
        
        <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for books, authors, or genres..."
              className="w-full pl-12 pr-4 py-3 text-lg rounded-full"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/3 lg:w-1/4">
                <FilterSidebar
                    onGetRecommendations={handleGetRecommendations}
                    setLoading={handleLoadingState}
                    onFilterChange={handleFilterChange}
                />
            </aside>
            <div className="w-full md:w-2/3 lg:w-3/4">
                {isInitialState && (
                    <div className="h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center bg-card">
                        <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <h2 className="text-2xl font-bold font-headline">Discover Your Next Story</h2>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            Use the filters on the left to search for specific books or get personalized AI recommendations based on your favorite genres.
                        </p>
                    </div>
                )}
                {isPending && (
                    <div className="text-center p-8">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground text-lg">Finding stories for you...</p>
                    </div>
                )}
                {!isPending && !isInitialState && recommendations.length > 0 && (
                     <div className="mt-6 md:mt-0">
                        <h2 className="text-3xl font-bold mb-6 font-headline">
                            Your Personal Reading List
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.map((rec, index) => {
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
                                );
                            })}
                        </div>
                    </div>
                )}
                 {!isPending && !isInitialState && recommendations.length === 0 && searchResults.length > 0 && (
                     <div className="mt-6 md:mt-0">
                        <h2 className="text-3xl font-bold mb-6 font-headline">
                            Search Results
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                           {searchResults.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                 )}
                 {!isPending && !isInitialState && recommendations.length === 0 && searchResults.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center bg-card">
                         <h2 className="text-2xl font-bold font-headline">No Results Found</h2>
                         <p className="text-muted-foreground mt-2 max-w-md">
                            Try adjusting your search or filters, or use the AI recommendations to find something new.
                         </p>
                    </div>
                 )}
            </div>
        </div>
      </main>
    </div>
  );
}
