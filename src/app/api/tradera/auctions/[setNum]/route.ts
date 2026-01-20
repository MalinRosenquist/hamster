import { NextResponse } from "next/server";
import { getTraderaAuctionsBySetNum } from "@/server/services/traderaService";

function statusFromServiceError(message: string): number | null {
  const match = message.match(/^HTTP\s(\d{3})\b/);
  return match ? Number(match[1]) : null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ setNum: string }> }
) {
  const { setNum } = await params;

  if (!setNum?.trim()) {
    return NextResponse.json(
      { error: true, message: "Invalid set number" },
      { status: 400 }
    );
  }

  try {
    const data = await getTraderaAuctionsBySetNum(setNum.trim());
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = statusFromServiceError(message) ?? 500;
    return NextResponse.json({ error: true, message }, { status });
  }
}
