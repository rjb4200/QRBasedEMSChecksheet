import PDFDocument from "pdfkit";
import { existsSync } from "node:fs";
import path from "node:path";
import { getDailyUnitRecords } from "@/lib/archive-records";
import { getShiftNameForDate } from "@/lib/shifts";

const PAGE_MARGIN = 18;
const WFD_LOGO_PATH = path.join(process.cwd(), "public", "images", "WFD_Logo_1848.jpg");
const CITY_SEAL_PATH = path.join(process.cwd(), "public", "images", "City of winchester Seal.png");

// Verify pdfkit fonts are reachable at runtime (belt and suspenders for Vercel)
function verifyFontAccess() {
  const fontFile = "Helvetica.afm";
  const candidates = [
    path.join(process.cwd(), "node_modules", "pdfkit", "js", "data", fontFile),
    path.join(process.cwd(), ".next", "server", "vendor-chunks", "pdfkit", "js", "data", fontFile),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return;
  }
  console.warn("pdfkit fonts not found via process.cwd() — relying on serverExternalPackages resolution");
}

const STATUS_LABELS: Record<string, string> = {
  checked: "Checked",
  incomplete: "Incomplete",
  not_started: "Not started",
  not_required: "Not required",
};

function drawImageIfPresent(doc: PDFKit.PDFDocument, imagePath: string, x: number, y: number, options: { width?: number; height?: number }) {
  if (!existsSync(imagePath)) return;
  try {
    doc.image(imagePath, x, y, options);
  } catch {
    // Text headers remain complete if an image asset cannot be embedded.
  }
}

function collectPdfBuffer(document: PDFKit.PDFDocument) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    document.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    document.on("error", reject);
    document.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function formatTimeOnly(value: string | null) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", second: "2-digit" }) : "Not recorded";
}

function truncateText(text: string, maxLen: number) {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "..." : text;
}

function drawTableRow(doc: PDFKit.PDFDocument, y: number, columns: { x: number; width: number }[], cells: string[], isHeader: boolean, rowHeight: number) {
  const maxCellHeight = Math.max(...cells.map((cell, i) => {
    const opts = { width: columns[i].width - 4, lineBreak: true };
    return isHeader ? doc.heightOfString(cell, opts) : doc.heightOfString(cell, opts);
  }));
  const actualRowHeight = Math.max(rowHeight, maxCellHeight + 4);

  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    if (isHeader) {
      doc.rect(col.x, y, col.width, actualRowHeight).fillAndStroke("#020617", "#020617");
      doc.font("Helvetica-Bold").fontSize(6).fillColor("white").text(cells[i], col.x + 2, y + 2, { width: col.width - 4, lineBreak: true });
    } else {
      doc.rect(col.x, y, col.width, actualRowHeight).strokeColor("#cbd5e1").lineWidth(0.4).stroke();
      doc.font("Helvetica").fontSize(5.5).fillColor("black").text(cells[i], col.x + 2, y + 2, { width: col.width - 4, lineBreak: true });
    }
  }

  return actualRowHeight;
}

export async function generateDailyChecksheetsPdf(date: string) {
  verifyFontAccess();
  const { records } = await getDailyUnitRecords({ from: date, to: date });
  const shiftName = getShiftNameForDate(date);
  const pdf = new PDFDocument({ size: "LETTER", layout: "landscape", margin: PAGE_MARGIN });
  const bufferPromise = collectPdfBuffer(pdf);

  const pageWidth = pdf.page.width;
  const contentWidth = pageWidth - PAGE_MARGIN * 2;

  // Header branding
  drawImageIfPresent(pdf, WFD_LOGO_PATH, PAGE_MARGIN, PAGE_MARGIN + 2, { width: 32, height: 32 });
  pdf.font("Helvetica-Bold").fontSize(7).fillColor("#b91c1c").text("WINCHESTER FIRE DEPARTMENT", PAGE_MARGIN + 40, PAGE_MARGIN + 2);
  pdf.font("Helvetica-Bold").fontSize(14).fillColor("black").text("Daily Unit Readiness Ledger", PAGE_MARGIN + 40, PAGE_MARGIN + 12);
  pdf.font("Helvetica-Bold").fontSize(8).fillColor("#475569").text(`Operational Date: ${date} | ${shiftName}`, PAGE_MARGIN + 40, PAGE_MARGIN + 28);

  drawImageIfPresent(pdf, CITY_SEAL_PATH, pageWidth - PAGE_MARGIN - 28, PAGE_MARGIN, { width: 28, height: 28 });
  pdf.font("Helvetica-Bold").fontSize(7).fillColor("black").text(`Generated ${new Date().toLocaleString()}`, pageWidth - PAGE_MARGIN - 160, PAGE_MARGIN, { width: 128, align: "right" });

  // Column layout
  const colWidths = [0.12, 0.08, 0.13, 0.09, 0.32, 0.16, 0.10];
  const colX = colWidths.map((w, i) => PAGE_MARGIN + colWidths.slice(0, i).reduce((sum, pw) => sum + pw * contentWidth, 0));
  const columns = colX.map((x, i) => ({ x, width: colWidths[i] * contentWidth }));

  let y = PAGE_MARGIN + 56;
  const headerHeight = 18;
  const rowHeight = 16;
  const maxY = pdf.page.height - PAGE_MARGIN;

  // Header row
  y += drawTableRow(pdf, y, columns, ["Unit", "Service", "Check Status", "Sections", "Exceptions", "Comments", "Crew"], true, headerHeight);
  y += 2;

  for (const record of records) {
    if (y + rowHeight > maxY) {
      pdf.addPage();
      y = PAGE_MARGIN;
      y += drawTableRow(pdf, y, columns, ["Unit", "Service", "Check Status", "Sections", "Exceptions", "Comments", "Crew"], true, headerHeight);
      y += 2;
    }

    const statusText = record.checkStatus === "checked"
      ? `Checked\n${formatTimeOnly(record.submittedAt)}`
      : STATUS_LABELS[record.checkStatus] || record.checkStatus;

    const exceptionsText = record.exceptions.length === 0
      ? "None"
      : truncateText(record.exceptions.map((e) => `${e.targetName}: ${e.itemName} - ${e.issue}`).join("; "), 280);

    const cells = [
      record.unitName,
      `${record.unitStatus.replaceAll("_", " ")}${record.archived ? " / archived" : ""}`,
      statusText,
      `${record.completedCompartments}/${record.totalCompartments}  ${record.completionPercentage}%`,
      exceptionsText,
      truncateText(record.comments || "-", 160),
      record.crewLocked ? (record.providerNames || "Locked") : "Not locked",
    ];

    y += drawTableRow(pdf, y, columns, cells, false, rowHeight);
  }

  pdf.end();

  return {
    filename: `daily-check-archive-${date}.pdf`,
    content: await bufferPromise,
  };
}
