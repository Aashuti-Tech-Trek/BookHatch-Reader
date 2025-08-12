
import Link from "next/link";
import Image from "next/image";
import { type Book } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-[2/3] w-full overflow-hidden">
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
        <CardContent className="p-4">
          <Badge variant="outline" className="mb-2">{book.genre}</Badge>
          <CardTitle className="text-lg leading-tight font-headline truncate">
            {book.title}
          </CardTitle>
          <CardDescription className="mt-1 text-sm truncate">
            {book.author}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
