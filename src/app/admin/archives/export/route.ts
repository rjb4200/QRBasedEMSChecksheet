import { NextResponse, type NextRequest } from "next/server";
import { archiveRecordToCsv, getDailyUnitRecords } from "@/lib/archive-records";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const { range, records } = await getDailyUnitRecords({
    unitId: searchParams.get("unitId") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });
  const csv = archiveRecordToCsv(records);

  return new NextResponse(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="checkoff-records-${range.from}-to-${range.to}.csv"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
