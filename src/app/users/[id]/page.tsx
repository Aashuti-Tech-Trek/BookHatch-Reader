
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { books } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Heart, Star, UserPlus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookCard } from "@/components/book-card";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch user data from a database.
  // For now, we'll find the author from our static data.
  const authorName = decodeURIComponent(params.id);
  const authorBooks = books.filter((b) => b.author === authorName);

  if (authorBooks.length === 0) {
    notFound();
  }

  // Placeholder data for the author profile
  const author = {
    name: authorName,
    bio: `An acclaimed author known for captivating stories in the ${authorBooks[0].genre} genre. With a passion for creating immersive worlds and unforgettable characters, ${authorName} has garnered a dedicated following.`,
    profilePicture: "https://placehold.co/128x128.png",
    totalLikes: 12345,
    averageRating: 4.8,
    followers: 5678,
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
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
            <aside className="w-full md:w-1/4 flex flex-col items-center text-center p-4 border rounded-lg bg-card">
                 <Image
                    src={author.profilePicture}
                    alt={`Profile of ${author.name}`}
                    width={128}
                    height={128}
                    className="rounded-full mb-4 shadow-lg"
                    data-ai-hint="person portrait"
                  />
                <h1 className="text-3xl font-bold font-headline">{author.name}</h1>
                <p className="text-muted-foreground mt-2 text-sm">{author.bio}</p>
                 <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{author.totalLikes.toLocaleString()} Likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{author.averageRating} Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <UserPlus className="h-4 w-4" />
                        <span>{author.followers.toLocaleString()} Followers</span>
                    </div>
                </div>
                 <Button className="mt-4 w-full">Follow</Button>
            </aside>
            <div className="w-full md:w-3/4">
                <h2 className="text-2xl font-bold font-headline mb-4">Published Stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {authorBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
