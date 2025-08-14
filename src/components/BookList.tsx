"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Book } from "@/DTOs/Book";
import { Genre } from "@/DTOs/Genre";
import { useDebounce } from "@/hooks/useDebounce";

type BookListProps = {
  initialBooks: Book[];
  genres: Genre[];
  currentUserId?: string;
  error?: string | null;
};

export function BookList({ initialBooks, genres, currentUserId, error }: BookListProps) {
  if (error) {
    return (
      <div className="py-16 text-center text-red-600 bg-red-50 border border-red-200 rounded-md shadow-sm">
        <h2 className="text-xl font-bold">Data fetching error</h2>
        <p className="mt-2 text-red-500">{error}</p>
        <p className="mt-4 text-sm text-gray-500">Please try refreshing the page later.</p>
      </div>
    );
  }

  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchFilteredBooks = useCallback(async () => {
    setIsFiltering(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) {
        params.append("query", debouncedSearchTerm);
      }
      if (selectedGenre) {
        params.append("genreId", selectedGenre);
      }

      const response = await fetch(`/api/books?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to filter books.");

      const filteredData = await response.json();
      setBooks(filteredData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFiltering(false);
    }
  }, [debouncedSearchTerm, selectedGenre]);

  useEffect(() => {
    if (debouncedSearchTerm === "" && selectedGenre === "") {
      setBooks(initialBooks);
      return;
    }
    fetchFilteredBooks();
  }, [debouncedSearchTerm, selectedGenre, fetchFilteredBooks, initialBooks]);

  return (
    <>
      <div className="p-6 space-y-4 bg-white border rounded-lg shadow-sm md:flex md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition-colors duration-200 hover:text-gray-800"
              aria-label="Clear the search"
            >
              <span className="text-l font-bold select-none">x</span>
            </button>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <select
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
            className="block w-full py-2 pl-3 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="">All genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">All books</h2>
        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-300 ${isFiltering ? "opacity-50" : "opacity-100"}`}
        >
          {books.map(book => {
            const isOwner = book.ownerId === currentUserId;
            return (
              <Link href={`/books/${book.id}`} key={book.id}>
                <div
                  className={`overflow-hidden duration-300 bg-white rounded-lg shadow-sm cursor-pointer group transition-all hover:shadow-xl hover:-translate-y-1 ${
                    isOwner ? "border-2 border-primary-400 ring-2 ring-primary-400/20" : "border"
                  }`}
                >
                  <div className="relative w-full h-56">
                    <Image
                      src={book.images[0]}
                      alt={`Cover of ${book.title}`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    {isOwner && (
                      <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full bg-primary-600">
                        Your book
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">{book.title}</h3>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {!isFiltering && books.length === 0 && (
          <div className="py-16 text-center text-gray-500 bg-white border rounded-md shadow-sm">
            <p className="text-lg">Books matching your criteria have not been found.</p>
          </div>
        )}
      </div>
    </>
  );
}
