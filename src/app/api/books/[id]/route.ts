import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { bookSchema } from "@/schemas/bookSchema";
import { z } from "zod";

const API_URL = process.env.DB_URL;

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id: bookId } = await params;

  if (!API_URL) {
    return new NextResponse("API URL not configured", { status: 500 });
  }

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`);

    if (!response.ok) {
      return new NextResponse("Book not found", { status: 404 });
    }

    const book = await response.json();

    return NextResponse.json(book);
  } catch (error) {
    console.error(`API_BOOKS_GET_ERROR for bookId ${bookId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const { id: bookId } = await params;

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!API_URL) {
    return new NextResponse("API URL not configured", { status: 500 });
  }

  try {
    const bookRes = await fetch(`${API_URL}/books/${bookId}`);
    if (!bookRes.ok) {
      return new NextResponse("Book not found", { status: 404 });
    }
    const currentBook = await bookRes.json();
    if (currentBook.ownerId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedData = bookSchema.partial().parse(body);

    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      throw new Error("Failed to update book on server.");
    }

    const updatedBook = await response.json();
    return NextResponse.json(updatedBook);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ errors: z.flattenError(error).fieldErrors }, { status: 400 });
    }
    console.error("API_BOOKS_PATCH_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
