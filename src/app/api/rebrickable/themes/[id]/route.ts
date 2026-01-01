import { getThemeById } from "@/server/services/themeService";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const themeId = Number(id);

  if (!Number.isFinite(themeId)) {
    return NextResponse.json(
      { error: true, message: "Invalid theme id" },
      { status: 400 }
    );
  }

  try {
    const data = await getThemeById(themeId);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: true, message: message }, { status: 500 });
  }
}
