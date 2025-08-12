
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { books } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Edit, PlusCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookCard } from "@/components/book-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { EditProfileSheet } from "@/components/edit-profile-sheet";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export interface UserProfile {
  name: string;
  bio: string;
  profilePicture: string;
}

export default function MyProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile>({
    name: "Alex Doe",
    bio: "An avid reader of science fiction and fantasy. Always looking for the next great adventure between the pages.",
    profilePicture: "https://placehold.co/128x128.png",
  });

  const currentlyReading = books.slice(0, 2);
  const readHistory = books.slice(2, 5);
  const wishlist = books.slice(5, 7);
  // Filter stories to only show those by the current mock user "Alex Doe"
  const myStories = books.filter(book => book.author === user.name);

  const handleProfileUpdate = (newProfile: UserProfile) => {
    setUser(newProfile);
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

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <aside className="w-full md:w-1/4 flex flex-col items-center text-center p-6 border rounded-lg bg-card shadow-lg">
                 <Image
                    src={user.profilePicture}
                    alt={`Profile of ${user.name}`}
                    width={128}
                    height={128}
                    className="rounded-full mb-4 ring-2 ring-primary ring-offset-4 ring-offset-background object-cover"
                    data-ai-hint="person portrait"
                  />
                <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
                <p className="text-muted-foreground mt-2">{user.bio}</p>
                 <EditProfileSheet user={user} onProfileUpdate={handleProfileUpdate}>
                    <Button variant="outline" className="mt-4 w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                </EditProfileSheet>
            </aside>
            <div className="w-full md:w-3/4">
                <Tabs defaultValue="reading">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="reading">Currently Reading</TabsTrigger>
                        <TabsTrigger value="history">Read History</TabsTrigger>
                        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                        <TabsTrigger value="stories">My Stories</TabsTrigger>
                    </TabsList>
                    <Separator className="my-6" />
                    <TabsContent value="reading">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentlyReading.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                         <Button variant="outline" className="mt-6 w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Find a new book
                        </Button>
                    </TabsContent>
                    <TabsContent value="history">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {readHistory.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="wishlist">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </TabsContent>
                     <TabsContent value="stories">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                           {myStories.map(book => (
                                <Link href={`/stories/${book.slug}/edit`} key={book.id} className="group">
                                    <Card className="h-full flex flex-col">
                                        <CardHeader>
                                             <div className="aspect-[2/3] w-full overflow-hidden rounded-md">
                                                <Image
                                                    src={book.coverImage}
                                                    alt={`Cover of ${book.title}`}
                                                    width={300}
                                                    height={450}
                                                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                                    data-ai-hint={`${book.genre} book`}
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <CardTitle className="font-headline text-lg">{book.title}</CardTitle>
                                            <CardDescription>{book.genre}</CardDescription>
                                        </CardContent>
                                        <CardFooter>
                                            <Button variant="outline" className="w-full">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Story
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        <Button asChild className="mt-6 w-full">
                           <Link href="/stories/new">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Story
                           </Link>
                        </Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
      </main>
    </div>
  );
}
