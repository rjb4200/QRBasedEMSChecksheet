import { type NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { generateExportPackage } from "@/lib/export-package";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "from and to query parameters are required" }, { status: 400 });
  }

  const unitId = searchParams.get("unitId") ?? undefined;

  const { archive, filename } = await generateExportPackage({ from, to, unitId });

  const webStream = Readable.toWeb(archive) as ReadableStream;

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
