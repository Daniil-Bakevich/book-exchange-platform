"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Genre } from "@/DTOs/Genre";
import { Status } from "@/DTOs/Status";
import { NewBookStatuses } from "@/types/bookTypes";

type FormErrors = {
  title?: string[];
  author?: string[];
  description?: string[];
  genreIds?: string[];
  statusId?: string[];
  images?: string[];
};

export function NewBookForm() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set());
  const [imageUrls, setImageUrls] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchData = async () => {
      const [genresRes, statusesRes] = await Promise.all([fetch("/api/genres"), fetch("/api/statuses")]);
      const genresData = await genresRes.json();
      const statusesData = await statusesRes.json();
      setGenres(genresData);
      setStatuses(statusesData);
    };
    fetchData();
  }, []);

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

    const formData = new FormData(event.currentTarget);
    const images = imageUrls.split("\n").filter(url => url.trim() !== "");

    const bookData = {
      title: formData.get("title"),
      author: formData.get("author"),
      description: formData.get("description"),
      genreIds: Array.from(selectedGenres),
      images: images,
      statusId: formData.get("statusId")
    };

    const response = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData)
    });

    if (response.ok) {
      router.push("/profile");
      router.refresh();
    } else {
      const errorData = await response.json();
      if (errorData.errors) {
        setErrors(errorData.errors);
      }
    }

    setIsSubmitting(false);
  };

  const availableStatuses = useMemo(() => {
    return statuses.filter(status => Object.values(NewBookStatuses).includes(status.name as NewBookStatuses));
  }, [statuses]);

  return (
    <form onSubmit={handleSubmit} className="p-8 mt-6 space-y-6 bg-white border rounded-lg shadow-sm">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input type="text" name="title" id="title" required className="input-style w-full mt-1" />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>}
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Author
        </label>
        <input type="text" name="author" id="author" required className="input-style w-full mt-1" />
        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author[0]}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea name="description" id="description" rows={10} required className="input-style w-full mt-1" />
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
          {availableStatuses.map(status => (
            <div key={status.id} className="flex items-center">
              <input
                id={`status-${status.id}`}
                name="statusId"
                type="radio"
                value={status.id}
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

      <div className="pt-4 text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding..." : "Add a book"}
        </button>
      </div>
    </form>
  );
}
