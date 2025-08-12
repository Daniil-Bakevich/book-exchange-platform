import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";
import { updateUserSchema } from "@/schemas/updateUserSchema";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const body = await req.json();

  if (!session?.user || session.user.id !== params.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const validatedData = updateUserSchema.parse(body);

    if (Object.keys(validatedData).length === 0) {
      return new NextResponse("No data to update", { status: 400 });
    }

    const response = await fetch(`http://localhost:3001/users/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const updatedUser = await response.json();

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ errors: error.flatten().fieldErrors }),
        { status: 400 }
      );
    }
    console.error("UPDATE_USER_ERROR", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
