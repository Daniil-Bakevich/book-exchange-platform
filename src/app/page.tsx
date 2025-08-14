import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Book } from "@/DTOs/Book";
import { Genre } from "@/DTOs/Genre";
import { BookList } from "@/components/BookList";

const API_URL = process.env.DB_URL;

export default async function Home() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  let allBooks: Book[] = [];
  let allGenres: Genre[] = [];
  let fetchError: string | null = null;

  try {
    const [booksResponse, genresResponse] = await Promise.all([fetch(`${API_URL}/books`), fetch(`${API_URL}/genres`)]);

    if (!booksResponse.ok || !genresResponse.ok) {
      throw new Error("Failed to download data from the server.");
    }

    allBooks = await booksResponse.json();
    allGenres = await genresResponse.json();
  } catch (error: any) {
    fetchError = error.message || "An unknown error has occurred.";
    console.error("Data fetching error:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container w-full px-4 py-8 mx-auto space-y-8">
          <BookList initialBooks={allBooks} genres={allGenres} currentUserId={currentUserId} error={fetchError} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
