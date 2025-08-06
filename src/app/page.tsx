
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { type Book, books, genres } from "@/lib/data";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, Sparkles, Search } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function Home() {

  const featuredBooks = useMemo(() => books.slice(0, 4), []);
  const genresWithBooks = useMemo(() => {
    return genres
      .map((genre) => ({
        genre,
        books: books.filter((book) => book.genre === genre),
      }))
      .filter((genre) => genre.books.length > 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">
              BookHatch Reader
            </span>
          </Link>
          <div className="flex-1" />
          <nav className="flex items-center space-x-1 sm:space-x-2">
             <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/recommendations">
                <Sparkles className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Recommendations</span>
              </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-grow container py-8">
        <section className="mb-12">
            <Carousel
                opts={{
                align: "start",
                loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                {featuredBooks.map((book) => (
                    <CarouselItem key={book.id}>
                    <Link href={`/books/${book.id}`}>
                        <div className="relative aspect-[2/1] md:aspect-[3/1] w-full rounded-lg overflow-hidden">
                        <Image
                            src={book.coverImage}
                            alt={`Cover of ${book.title}`}
                            fill
                            className="object-cover"
                             data-ai-hint={`${book.genre} book landscape`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">{book.title}</h2>
                            <p className="text-white/90 mt-2 max-w-prose">{book.description}</p>
                        </div>
                        </div>
                    </Link>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </section>
        
        <div className="space-y-12">
            {genresWithBooks.map(({ genre, books: genreBooks }) => (
                <section key={genre}>
                    <h2 className="text-2xl font-bold font-headline mb-4">{genre}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {genreBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </section>
            ))}
        </div>

      </main>
      <footer className="container py-6 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} BookHatch Reader. All rights reserved.
      </footer>
    </div>
  );
}
