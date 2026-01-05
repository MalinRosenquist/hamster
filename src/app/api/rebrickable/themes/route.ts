import { getThemes, getThemeThumbnail } from "@/server/services/themeService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "10");

  try {
    const data = await getThemes(page, pageSize);

    const results = await Promise.all(
      data.results.map(async (theme) => ({
        ...theme,
        thumb: await getThemeThumbnail(theme.id),
      }))
    );

    return NextResponse.json({ count: data.count, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: true, message: message }, { status: 500 });
  }
}
