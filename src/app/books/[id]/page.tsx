
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { books } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen } from "lucide-react";

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = books.find((b) => b.id === params.id);

  if (!book) {
    notFound();
  }

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
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-1">
            <div className="aspect-[2/3] w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                width={400}
                height={600}
                className="w-full h-full object-cover"
                data-ai-hint={`${book.genre} book`}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <h1 className="text-4xl lg:text-5xl font-bold font-headline leading-tight">
              {book.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-lg text-muted-foreground">
                <Link href={`/users/${encodeURIComponent(book.author)}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <User className="h-5 w-5" />
                    <span>{book.author}</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    <Badge variant="secondary">{book.genre}</Badge>
                </div>
            </div>
            <p className="mt-6 text-base md:text-lg leading-relaxed">
              {book.longDescription}
            </p>
            <Button size="lg" className="mt-8">Start Reading</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
