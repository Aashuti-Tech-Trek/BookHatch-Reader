
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { BookCard } from '@/components/book-card';
import { Book, genres } from '@/lib/data';
import { searchBooks } from '@/lib/actions/search';
import { BookOpen, ArrowLeft, Loader2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const genreParams = searchParams.get('genres')?.split(',') || [];

  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(genreParams);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      const books = await searchBooks(query, selectedGenres);
      setResults(books);
      setLoading(false);
    };

    performSearch();
  }, [query, selectedGenres]);

  const handleGenreChange = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">BookHatch Reader</span>
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

        <form action="/search" method="GET" className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search for books, authors, or genres..."
              className="w-full pl-10 pr-4 py-2 text-lg rounded-full"
            />
        </form>

        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">
                Search Results {query && <span className="text-muted-foreground">for &quot;{query}&quot;</span>}
            </h1>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {genres.map((genre) => (
                         <DropdownMenuItem key={genre} onSelect={(e) => e.preventDefault()}>
                            <Checkbox 
                                id={`genre-${genre}`}
                                checked={selectedGenres.includes(genre)}
                                onCheckedChange={() => handleGenreChange(genre)}
                                className="mr-2"
                            />
                            <Label htmlFor={`genre-${genre}`} className="font-normal">{genre}</Label>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">No Results Found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    )
}
