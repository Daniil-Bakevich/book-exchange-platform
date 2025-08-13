import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { CreateUser } from "@/DTOs/User";
import { registerSchema } from "@/schemas/registerSchema";
import { z } from "zod";

const HASHING_COST_FACTOR = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, name, password } = await registerSchema.parseAsync(body);

    const userExistsResponse = await fetch(`http://localhost:3001/users?email=${email}`);
    const existingUsers = await userExistsResponse.json();

    if (existingUsers.length > 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          errors: {
            email: ["User with this email already exists"]
          }
        }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, HASHING_COST_FACTOR);

    const user: CreateUser = {
      email,
      name,
      avatar: "/No_avatar.png",
      registrationDate: new Date().toISOString(),
      hashedPassword
    };

    const newUserResponse = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const newUser = await newUserResponse.json();

    delete newUser.hashedPassword;

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ success: false, errors: z.flattenError(error).fieldErrors }), {
        status: 400
      });
    }

    console.error("REGISTRATION_ERROR", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
