import { NextRequest, NextResponse } from "next/server";
import { Book } from "@/DTOs/Book";
import { auth } from "@/auth";
import { bookSchema } from "@/schemas/bookSchema";
import { z } from "zod";

const API_URL = process.env.DB_URL;

export async function GET(req: NextRequest) {
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

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!API_URL) {
    return new NextResponse("API URL not configured", { status: 500 });
  }

  try {
    const body = await req.json();

    const validatedData = bookSchema.parse(body);

    const newBook: Omit<Book, "id"> = {
      ...validatedData,
      ownerId: session.user.id,
      publicationDate: new Date().toISOString()
    };

    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook)
    });

    if (!response.ok) {
      throw new Error("Failed to create a book on server.");
    }

    const createdBook = await response.json();

    return NextResponse.json(createdBook, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ errors: z.flattenError(error).fieldErrors }, { status: 400 });
    }
    console.error("API_BOOKS_POST_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
