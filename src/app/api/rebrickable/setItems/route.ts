import { getSetItems } from "@/server/services/setService";
import { NextResponse } from "next/server";

/**
 * Server-side proxy endpoint:
 * - The browser calls our endpoint
 * - The server calls Rebrickable with the API key
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Supported query params
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "10");
  const themeIdParam = searchParams.get("theme_id");
  const themeId = themeIdParam ? Number(themeIdParam) : undefined;
  const search = searchParams.get("search") ?? undefined;

  try {
    const data = await getSetItems(page, pageSize, themeId, search);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: true, message: message }, { status: 500 });
  }
}
