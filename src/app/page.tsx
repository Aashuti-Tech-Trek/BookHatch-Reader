
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { type Book, books, genres } from "@/lib/data";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, Search, User, LogIn, LogOut, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Home() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const { user, signOut: firebaseSignOut } = useAuth();
  const [headline, setHeadline] = useState("Featured Books");
  const [visibleBookCounts, setVisibleBookCounts] = useState({
    'Science Fiction': 3,
    'Fantasy': 3,
    'Thriller': 3,
  });

  const featuredBooks = books.slice(0, 5);
  
  // Create a unique list of authors for the "Top Authors" section
  const authors = [...new Map(books.map(book => [book.author, book])).values()]
    .slice(0, 10)
    .map(book => ({
        name: book.author,
        slug: book.author.toLowerCase().replace(/\s+/g, '-'),
        image: `https://placehold.co/100x100.png` 
    }));
  
  const genresWithBooks = genres
    .map((genre) => ({
      name: genre,
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

  const handleShowMore = (genre: keyof typeof visibleBookCounts) => {
    setVisibleBookCounts(prev => ({
        ...prev,
        [genre]: prev[genre] === 3 ? 10 : books.filter(b => b.genre === genre).length
    }));
  };

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
            <Button asChild variant="ghost">
              <Link href="/recommendations">
                <Search className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
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
          <h2 className="text-3xl font-bold font-headline mb-4 px-4">{headline}</h2>
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

        <section className="mb-12">
            <h2 className="text-3xl font-bold font-headline mb-4">Authors of the Month</h2>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                 plugins={[
                    Autoplay({
                      delay: 4000,
                      stopOnInteraction: true,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {authors.map((author) => (
                        <CarouselItem key={author.slug} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <Link href={`/users/${author.slug}`} className="group">
                                <div className="flex flex-col items-center text-center gap-2">
                                     <Avatar className="h-24 w-24 ring-2 ring-transparent group-hover:ring-primary transition-all duration-300">
                                        <AvatarImage src={author.image} alt={author.name} data-ai-hint="person portrait" />
                                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{author.name}</h3>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>

        <div className="space-y-12">
          {genresWithBooks.map(({ name: genre, books: genreBooks }) => {
             const genreKey = genre as keyof typeof visibleBookCounts;
             if (visibleBookCounts.hasOwnProperty(genreKey)) {
              return (
                <section key={genre}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-headline">{genre}</h2>
                    {genreBooks.length > 3 && (visibleBookCounts[genreKey] || 0) < genreBooks.length && (
                       <Button variant="link" onClick={() => handleShowMore(genreKey)} className="text-primary">
                          {(visibleBookCounts[genreKey] || 0) === 3 ? 'Show More' : 'View All'}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {genreBooks.slice(0, visibleBookCounts[genreKey]).map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </section>
              );
            }
            return (
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
            )
          })}
        </div>
      </main>
      <footer className="container py-6 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} BookHatch Reader. All rights reserved.
      </footer>
    </div>
  );
}
