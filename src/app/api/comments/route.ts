import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const API_URL = process.env.DB_URL;
  if (!API_URL) {
    return new NextResponse("API URL not configured", { status: 500 });
  }

  try {
    const { text, bookId } = await req.json();

    if (!text || !bookId) {
      return new NextResponse("Missing text or bookId", { status: 400 });
    }

    const newComment = {
      text,
      bookId: String(bookId),
      authorId: session.user.id,
      createdAt: new Date().toISOString()
    };

    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment)
    });

    if (!response.ok) {
      throw new Error("Failed to post comment to json-server.");
    }

    const createdComment = await response.json();

    return NextResponse.json(createdComment, { status: 201 });
  } catch (error) {
    console.error("API_COMMENTS_POST_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
