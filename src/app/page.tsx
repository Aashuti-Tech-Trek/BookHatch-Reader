
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { type Book, books, genres } from "@/lib/data";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, Sparkles, Search, User, LogIn, LogOut } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const { user, signOut: firebaseSignOut } = useAuth();

  const featuredBooks = books.slice(0, 5);
  const genresWithBooks = genres
    .map((genre) => ({
      genre,
      books: books.filter((book) => book.genre === genre),
    }))
    .filter((genre) => genre.books.length > 0);

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  
  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);


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
             {user ? (
                <>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/profile">
                      <User className="h-5 w-5" />
                      <span className="sr-only">My Profile</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={firebaseSignOut}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Button variant="ghost" asChild>
                   <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4"/>
                    Login
                  </Link>
                </Button>
              )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container py-8">
        <section className="mb-12">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
                Autoplay({
                  delay: 5000,
                  stopOnInteraction: true,
                }),
              ]}
            className="w-full"
          >
            <CarouselContent>
              {featuredBooks.map((book) => (
                <CarouselItem key={book.id}>
                  <Link href={`/books/${book.slug}`}>
                    <div className="relative aspect-[2/1] md:aspect-[3/1] w-full rounded-lg overflow-hidden">
                      <Image
                        src={book.coverImage}
                        alt={`Cover of ${book.title}`}
                        fill
                        className="object-cover"
                        data-ai-hint={`${book.genre} book landscape`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">
                          {book.title}
                        </h2>
                        <p className="text-white/90 mt-2 max-w-prose">
                          {book.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                {Array.from({ length: count }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    i === current - 1 ? "bg-primary" : "bg-white/50 hover:bg-white"
                    )}
                >
                     <span className="sr-only">Go to slide {i + 1}</span>
                </button>
                ))}
            </div>
          </Carousel>
        </section>

        <div className="space-y-12">
          {genresWithBooks.map(({ genre, books: genreBooks }) => (
            <section key={genre}>
              <h2 className="text-2xl font-bold font-headline mb-4">
                {genre}
              </h2>
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
