import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !/^\+?[0-9\s-]{8,15}$/.test(body.phone ?? "")) return NextResponse.json({ error: "A valid name and phone are required." }, { status: 400 });
  return NextResponse.json({ id: `AS-${Date.now().toString().slice(-7)}`, status: "New" }, { status: 201 });
}
