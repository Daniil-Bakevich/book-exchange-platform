import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const { id: commentId } = await params;

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const API_URL = process.env.DB_URL;
  if (!API_URL) {
    return new NextResponse("API URL not configured", { status: 500 });
  }

  try {
    const commentRes = await fetch(`${API_URL}/comments/${commentId}`);
    if (!commentRes.ok) {
      return new NextResponse("Comment not found", { status: 404 });
    }
    const comment = await commentRes.json();

    if (comment.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const deleteResponse = await fetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE"
    });

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete comment on server.");
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("API_COMMENT_DELETE_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
