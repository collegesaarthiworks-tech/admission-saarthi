import { NextRequest, NextResponse } from "next/server";
import { publicCatalog, readCatalog, writeCatalog } from "../../../lib/catalog-store";

export const dynamic = "force-dynamic";

const buckets = new Map<string, { count: number; reset: number }>();
function rateLimited(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) { buckets.set(key, { count: 1, reset: now + 60_000 }); return false; }
  bucket.count += 1;
  return bucket.count > 60;
}

function canManage(request: NextRequest) {
  const configured = process.env.ONBOARDING_ADMIN_KEY;
  return !configured || request.headers.get("x-admin-key") === configured;
}

export async function GET(request: NextRequest) {
  const data = await readCatalog();
  const manage = request.nextUrl.searchParams.get("manage") === "1";
  if (manage && !canManage(request)) return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  return NextResponse.json(manage ? data : publicCatalog(data), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  if (!canManage(request)) return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  const body = await request.json();
  const data = await readCatalog();
  if (body.kind === "caseStudy") {
    const record = { ...body.record, id: body.record.id || crypto.randomUUID() };
    data.caseStudies = [record, ...data.caseStudies.filter(item => item.id !== record.id)];
    await writeCatalog(data);
    return NextResponse.json(record, { status: 201 });
  }
  const record = { ...body.record, id: body.record.id || crypto.randomUUID(), updatedAt: new Date().toISOString() };
  data.providers = [record, ...data.providers.filter(item => item.id !== record.id)];
  await writeCatalog(data);
  return NextResponse.json(record, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!canManage(request)) return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  const kind = request.nextUrl.searchParams.get("kind");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data = await readCatalog();
  if (kind === "caseStudy") data.caseStudies = data.caseStudies.filter(item => item.id !== id);
  else data.providers = data.providers.filter(item => item.id !== id);
  await writeCatalog(data);
  return NextResponse.json({ ok: true });
}
