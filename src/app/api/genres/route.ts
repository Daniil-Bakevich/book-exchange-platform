import { NextResponse } from "next/server";

export async function GET() {
  const API_URL = process.env.DB_URL;

  if (!API_URL) {
    return new NextResponse("API URL not configured", { status: 500 });
  }

  try {
    const response = await fetch(`${API_URL}/genres`);

    if (!response.ok) {
      throw new Error(`Failed to fetch from API: ${response.statusText}`);
    }

    const genres = await response.json();
    return NextResponse.json(genres);
  } catch (error) {
    console.error("API_GENRES_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
