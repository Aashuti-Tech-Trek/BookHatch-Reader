
"use server";

import { books, Book } from "@/lib/data";

interface SearchFilters {
  searchQuery?: string;
  genres?: string[];
  author?: string;
  status?: "all" | "published" | "ongoing";
  rating?: "all" | "mature";
}

export async function searchBooks(filters: SearchFilters): Promise<Book[]> {
  const { searchQuery, genres, author, status, rating } = filters;
  const lowercasedQuery = searchQuery?.toLowerCase() || "";
  const lowercasedAuthor = author?.toLowerCase() || "";

  // In a real app, this would be a database query.
  // For now, we filter the static data.
  const results = books.filter(book => {
    // Search Query Filter
    const matchesQuery = lowercasedQuery
      ? book.title.toLowerCase().includes(lowercasedQuery) ||
        book.author.toLowerCase().includes(lowercasedQuery) ||
        book.description.toLowerCase().includes(lowercasedQuery) ||
        book.genre.toLowerCase().includes(lowercasedQuery)
      : true;

    // Genre Filter
    const matchesGenre = genres && genres.length > 0
      ? genres.includes(book.genre)
      : true;

    // Author Filter
    const matchesAuthor = lowercasedAuthor
      ? book.author.toLowerCase().includes(lowercasedAuthor)
      : true;
      
    // Status Filter (placeholder, as static data doesn't have this)
    const matchesStatus = status && status !== 'all' ? true : true; // e.g. book.isPublished === (status === 'published')
    
    // Rating Filter (placeholder)
    const matchesRating = rating && rating !== 'all' ? true : true; // e.g. book.isMature === (rating === 'mature')

    return matchesQuery && matchesGenre && matchesAuthor && matchesStatus && matchesRating;
  });

  return results;
}
