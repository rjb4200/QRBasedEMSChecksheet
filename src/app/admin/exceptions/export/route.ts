import { NextResponse, type NextRequest } from "next/server";
import { discrepancyRecordsToCsv, getCheckoffDiscrepanciesForRange, getDiscrepancyRange } from "@/lib/discrepancies";

export async function GET(request: NextRequest) {
  const range = getDiscrepancyRange({
    from: request.nextUrl.searchParams.get("from") ?? undefined,
    to: request.nextUrl.searchParams.get("to") ?? undefined,
  });
  const discrepancies = await getCheckoffDiscrepanciesForRange(range.from, range.to);

  return new NextResponse(discrepancyRecordsToCsv(discrepancies), {
    headers: {
      "Content-Disposition": `attachment; filename="checkoff-exceptions-${range.from}-to-${range.to}.csv"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
