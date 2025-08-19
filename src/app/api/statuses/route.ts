import { NextResponse } from "next/server";

export async function GET() {
  const API_URL = process.env.DB_URL;

  if (!API_URL) {
    return new NextResponse("API URL not configured", { status: 500 });
  }

  try {
    const response = await fetch(`${API_URL}/statuses`);

    if (!response.ok) {
      throw new Error(`Failed to fetch from API: ${response.statusText}`);
    }

    const statuses = await response.json();

    return NextResponse.json(statuses);
  } catch (error) {
    console.error("API_STATUSES_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
