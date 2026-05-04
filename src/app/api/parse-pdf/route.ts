import { NextRequest, NextResponse } from "next/server";
import { parseFishPDFAndImport } from "@/lib/actions/fishSpecies";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await parseFishPDFAndImport(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("PDF parse API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
