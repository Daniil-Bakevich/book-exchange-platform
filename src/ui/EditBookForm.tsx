"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Genre } from "@/DTOs/Genre";
import { Status } from "@/DTOs/Status";
import { Book } from "@/DTOs/Book";
import { BackButton } from "@/components/BackButton";

type FormErrors = {
  title?: string[];
  author?: string[];
  description?: string[];
  genreIds?: string[];
  statusId?: string[];
  images?: string[];
};

export function EditBookForm() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [bookStatus, setBookStatus] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set());
  const [imageUrls, setImageUrls] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [bookRes, genresRes, statusesRes] = await Promise.all([
        fetch(`/api/books/${bookId}`),
        fetch("/api/genres"),
        fetch("/api/statuses")
      ]);

      if (!bookRes.ok) {
        router.push("/");
        return;
      }

      const [bookData, genresData, statusesData] = await Promise.all([
        bookRes.json(),
        genresRes.json(),
        statusesRes.json()
      ]);

      setBook(bookData);
      setGenres(genresData);
      setStatuses(statusesData);

      setSelectedGenres(new Set(bookData.genreIds));
      setDescription(bookData.description);
      setBookStatus(+bookData.statusId);
      setImageUrls(bookData.images.join("\n"));

      setIsLoading(false);
    };
    fetchData();
  }, [bookId, router]);

  const handleGenreChange = (genreId: number) => {
    const newSelection = new Set(selectedGenres);

    if (newSelection.has(genreId)) {
      newSelection.delete(genreId);
    } else {
      newSelection.add(genreId);
    }
    setSelectedGenres(newSelection);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!book) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const changedData: Partial<Book> = {};

    const newTitle = formData.get("title") as string;
    if (newTitle !== book.title) {
      changedData.title = newTitle;
    }

    const newAuthor = formData.get("author") as string;
    if (newAuthor !== book.author) {
      changedData.author = newAuthor;
    }

    const newDescription = formData.get("description") as string;
    if (newDescription !== book.description) {
      changedData.description = newDescription;
    }

    const newStatusId = Number(formData.get("statusId"));
    if (newStatusId !== +book.statusId) {
      changedData.statusId = String(newStatusId);
    }

    const newImages = imageUrls.split("\n").filter(url => url.trim() !== "");
    if (JSON.stringify(newImages) !== JSON.stringify(book.images)) {
      changedData.images = newImages;
    }

    const newGenreIds = Array.from(selectedGenres);
    if (JSON.stringify(newGenreIds.sort()) !== JSON.stringify([...book.genreIds].sort())) {
      changedData.genreIds = newGenreIds;
    }

    if (Object.keys(changedData).length === 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedData)
      });

      if (response.ok) {
        router.push(`/books/${bookId}`);
        router.refresh();
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          console.error("An error occurred while saving.");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="w-fit m-auto mt-[15%]">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 mt-6 space-y-6 bg-white border rounded-lg shadow-sm">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={book?.title}
          required
          className="input-style w-full mt-1"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>}
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Author
        </label>
        <input
          type="text"
          name="author"
          id="author"
          defaultValue={book?.author}
          required
          className="input-style w-full mt-1"
        />
        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author[0]}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={10}
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="input-style w-full mt-1"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Genres</label>
        <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3">
          {genres.map(genre => (
            <div key={genre.id} className="flex items-center">
              <input
                id={`genre-${genre.id}`}
                type="checkbox"
                checked={selectedGenres.has(Number(genre.id))}
                onChange={() => handleGenreChange(Number(genre.id))}
                className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
              />
              <label htmlFor={`genre-${genre.id}`} className="ml-2 text-sm text-gray-600">
                {genre.name}
              </label>
            </div>
          ))}
        </div>
        {errors.genreIds && <p className="mt-1 text-sm text-red-600">{errors.genreIds[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <div className="flex items-center mt-2 space-x-4">
          {statuses.map(status => (
            <div key={status.id} className="flex items-center">
              <input
                id={`status-${status.id}`}
                name="statusId"
                type="radio"
                value={status.id}
                checked={bookStatus === +status.id}
                onChange={() => setBookStatus(+status.id)}
                required
                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
              />
              <label htmlFor={`status-${status.id}`} className="ml-2 text-sm text-gray-600 capitalize">
                {status.name}
              </label>
            </div>
          ))}
        </div>
        {errors.statusId && <p className="mt-1 text-sm text-red-600">{errors.statusId[0]}</p>}
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
          Image URLs
        </label>
        <textarea
          id="images"
          name="images"
          value={imageUrls}
          onChange={e => setImageUrls(e.target.value)}
          rows={5}
          className="input-style w-full mt-1"
          placeholder="Insert each link from a new line..."
        />
        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images[0]}</p>}
      </div>

      <div className="flex pt-4 justify-between items-baseline">
        <BackButton />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 h-fit font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
