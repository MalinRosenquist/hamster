import { getSetBySetNum } from "@/server/services/setService";
import { NextResponse } from "next/server";

/**
 * Extract status code from service error messages.
 * serviceBase.get() throws errors like: "HTTP 429: ..."
 */
function statusFromServiceError(message: string): number | null {
  const match = message.match(/^HTTP\s(\d{3})\b/);
  return match ? Number(match[1]) : null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ setNum: string }> }
) {
  const { setNum } = await params;

  if (!setNum) {
    return NextResponse.json(
      { error: true, message: "Invalid set number" },
      { status: 400 }
    );
  }

  try {
    const data = await getSetBySetNum(setNum);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = statusFromServiceError(message) ?? 500;
    return NextResponse.json({ error: true, message }, { status });
  }
}
