
"use server";

import { books, Book } from "@/lib/data";

export async function searchBooks(query: string, genres: string[]): Promise<Book[]> {
  const lowercasedQuery = query.toLowerCase();

  // In a real app, this would be a database query.
  // For now, we filter the static data.
  const results = books.filter(book => {
    const matchesQuery =
      book.title.toLowerCase().includes(lowercasedQuery) ||
      book.author.toLowerCase().includes(lowercasedQuery) ||
      book.description.toLowerCase().includes(lowercasedQuery) ||
      book.genre.toLowerCase().includes(lowercasedQuery);

    const matchesGenre = genres.length > 0 ? genres.includes(book.genre) : true;

    return matchesQuery && matchesGenre;
  });

  return results;
}
