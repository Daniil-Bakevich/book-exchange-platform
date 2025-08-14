import { NextRequest, NextResponse } from "next/server";
import { Book } from "@/DTOs/Book";

export async function GET(req: NextRequest) {
  const API_URL = process.env.DB_URL;

  if (!API_URL) {
    return new NextResponse("API URL is not configured", { status: 500 });
  }

  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from API: ${response.statusText}`);
    }
    let books: Book[] = await response.json();

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query")?.toLowerCase();
    const genreId = searchParams.get("genreId");

    if (query) {
      books = books.filter(
        book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
      );
    }

    if (genreId) {
      books = books.filter(book => book.genreIds.includes(Number(genreId)));
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error("API_BOOKS_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
