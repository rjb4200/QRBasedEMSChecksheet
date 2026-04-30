import { NextResponse, type NextRequest } from "next/server";
import { archiveRecordToCsv, getDailyUnitRecords } from "@/lib/archive-records";
import { detailedChecksheetCsv, detailedChecksheetsCsv, getDailyChecksheetDocument } from "@/lib/checksheet-documents";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get("mode") ?? "simple";
  if (mode === "detailed") {
    const date = searchParams.get("date") ?? undefined;
    if (!date) {
      const { groups, range } = await getDailyUnitRecords({
        unitId: searchParams.get("unitId") ?? undefined,
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
      });
      const documents = await Promise.all(groups.map((group) => getDailyChecksheetDocument(group.date)));
      return new NextResponse(detailedChecksheetsCsv(documents), {
        headers: {
          "Content-Disposition": `attachment; filename="checkoff-records-detailed-${range.from}-to-${range.to}.csv"`,
          "Content-Type": "text/csv; charset=utf-8",
        },
      });
    }

    const document = await getDailyChecksheetDocument(date);
    return new NextResponse(detailedChecksheetCsv(document), {
      headers: {
        "Content-Disposition": `attachment; filename="checkoff-records-detailed-${document.date}.csv"`,
        "Content-Type": "text/csv; charset=utf-8",
      },
    });
  }

  const { range, records } = await getDailyUnitRecords({
    unitId: searchParams.get("unitId") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });
  const csv = archiveRecordToCsv(records);

  return new NextResponse(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="checkoff-records-simple-${range.from}-to-${range.to}.csv"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
