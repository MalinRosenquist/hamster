import { getSetBySetNum } from "@/server/services/setService";
import { NextResponse } from "next/server";

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
    return NextResponse.json({ error: true, message: message }, { status: 500 });
  }
}
