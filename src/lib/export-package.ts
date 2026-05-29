import { ZipArchive } from "archiver";
import crypto from "node:crypto";
import { getDailyUnitRecords, archiveRecordToCsv } from "@/lib/archive-records";
import { getDailyChecksheetDocument, detailedChecksheetsCsv } from "@/lib/checksheet-documents";
import { getCheckoffDiscrepanciesForRange, discrepancyRecordsToCsv } from "@/lib/discrepancies";
import { generateDailyChecksheetsPdf } from "@/lib/pdf/daily-checksheets";

function eachDateInRange(from: string, to: string) {
  const dates: string[] = [];
  const current = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

export async function generateExportPackage(params: { from: string; to: string; unitId?: string }) {
  const { from, to, unitId } = params;
  const dates = eachDateInRange(from, to);

  const [{ records }, discrepancies] = await Promise.all([
    getDailyUnitRecords({ from, to, unitId }),
    getCheckoffDiscrepanciesForRange(from, to).then((d) => unitId ? d.filter((disc) => disc.unitId === unitId) : d),
  ]);

  const documents = await Promise.all(dates.map((date) => getDailyChecksheetDocument(date)));
  const filteredDocuments = unitId
    ? documents.map((doc) => ({ ...doc, units: doc.units.filter((u) => u.id === unitId) }))
    : documents;

  const simpleCsv = archiveRecordToCsv(records);
  const detailedCsv = detailedChecksheetsCsv(filteredDocuments);
  const exceptionsCsv = discrepancyRecordsToCsv(discrepancies);

  const unitMap = new Map<string, { id: string; name: string; records: number; archiveIds: string[] }>();
  for (const record of records) {
    const existing = unitMap.get(record.unitId);
    if (existing) {
      existing.records++;
      if (record.archiveId) existing.archiveIds.push(record.archiveId);
    } else {
      unitMap.set(record.unitId, {
        id: record.unitId,
        name: record.unitName,
        records: 1,
        archiveIds: record.archiveId ? [record.archiveId] : [],
      });
    }
  }

  const pdfFilenames = dates.map((date) => `checksheet-${date}.pdf`);
  const manifest = {
    exportId: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    dateRange: { from, to },
    dateCount: dates.length,
    units: Array.from(unitMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    totalRecords: records.length,
    totalExceptions: discrepancies.length,
    contents: {
      csv: ["records-simple.csv", "records-detailed.csv", `exceptions-${from}-to-${to}.csv`],
      pdfs: pdfFilenames,
      manifest: "manifest.json",
    },
  };

  const archive = new ZipArchive({ zlib: { level: 9 } });

  archive.append(simpleCsv, { name: "records-simple.csv" });
  archive.append(detailedCsv, { name: "records-detailed.csv" });
  archive.append(exceptionsCsv, { name: `exceptions-${from}-to-${to}.csv` });

  for (const date of dates) {
    const { content, filename } = await generateDailyChecksheetsPdf(date);
    archive.append(content, { name: filename });
  }

  archive.append(JSON.stringify(manifest, null, 2), { name: "manifest.json" });

  archive.finalize();

  const filename = `checkoff-export-${from}-to-${to}.zip`;
  return { archive, manifest, filename };
}
