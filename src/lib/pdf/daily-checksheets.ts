import PDFDocument from "pdfkit";
import { existsSync } from "node:fs";
import path from "node:path";
import { formatDuration } from "@/lib/archive-records";
import { formatChecksheetTimestamp, formatChecksheetValue, getDailyChecksheetDocument, type DailyChecksheetDocument } from "@/lib/checksheet-documents";

const PAGE_MARGIN = 24;
const COLUMN_GAP = 10;
const COLUMN_COUNT = 3;
const WFD_LOGO_PATH = path.join(process.cwd(), "public", "images", "WFD_Logo_1848.jpg");
const CITY_SEAL_PATH = path.join(process.cwd(), "public", "images", "City of winchester Seal.png");

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

function writeCompartment(doc: PDFKit.PDFDocument, compartment: DailyChecksheetDocument["units"][number]["compartments"][number], x: number, y: number, width: number) {
  let currentY = y;
  doc.font("Helvetica-Bold").fontSize(7).fillColor("black").text(compartment.name, x, currentY, { width });
  doc.font("Helvetica").fontSize(5).fillColor("#475569").text(compartment.checkStatus.replace("_", " "), x, currentY + 8, { width });
  currentY += 18;

  if (compartment.items.length === 0) {
    doc.font("Helvetica").fontSize(5).fillColor("#64748b").text("No configured items.", x, currentY, { width });
    return currentY + 10;
  }

  for (const item of compartment.items) {
    const lineHeight = 8;
    const isException = item.status !== "ok";
    doc.font(isException ? "Helvetica-Bold" : "Helvetica").fontSize(5.4).fillColor(isException ? "#b91c1c" : "black");
    doc.text(item.name, x, currentY, { width: width * 0.58, lineBreak: false });
    doc.text(formatChecksheetValue(item.actual), x + width * 0.6, currentY, { width: width * 0.16, lineBreak: false });
    doc.text(item.expected === null ? "" : `Par ${formatChecksheetValue(item.expected)}`, x + width * 0.78, currentY, { width: width * 0.22, lineBreak: false });
    if (isException) {
      doc.moveTo(x, currentY + lineHeight - 1).lineTo(x + width, currentY + lineHeight - 1).strokeColor("#b91c1c").lineWidth(0.4).stroke();
    }
    currentY += lineHeight;
  }

  return currentY + 6;
}

function renderUnitPage(doc: PDFKit.PDFDocument, document: DailyChecksheetDocument, unit: DailyChecksheetDocument["units"][number], isFirstPage: boolean) {
  if (!isFirstPage) doc.addPage();

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  const columnWidth = (contentWidth - COLUMN_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

  drawImageIfPresent(doc, WFD_LOGO_PATH, PAGE_MARGIN, PAGE_MARGIN, { width: 34, height: 34 });
  const headerX = PAGE_MARGIN + 42;
  doc.font("Helvetica-Bold").fontSize(7).fillColor("#b91c1c").text("WINCHESTER FIRE DEPARTMENT", headerX, PAGE_MARGIN);
  doc.font("Helvetica-Bold").fontSize(15).fillColor("black").text("EMS Equipment Check Sheet", headerX, PAGE_MARGIN + 9);
  doc.font("Helvetica-Bold").fontSize(8).fillColor("black").text(`${unit.name} | ${document.date} | ${unit.shiftName}`, headerX, PAGE_MARGIN + 27);
  doc.font("Helvetica").fontSize(6).fillColor("#475569").text(`${unit.status.replace("_", " ")} | ${unit.archiveStatus.replace("_", " ")}`, headerX, PAGE_MARGIN + 38);
  if (unit.providerNames) doc.font("Helvetica-Bold").fontSize(6).fillColor("black").text(`Crew: ${unit.providerNames}`, headerX, PAGE_MARGIN + 47);
  doc.font("Helvetica").fontSize(6).fillColor("black").text(`Checked By: ${unit.checkedByName || "Not recorded"}`, headerX, PAGE_MARGIN + 56);
  doc.font("Helvetica").fontSize(6).fillColor("black").text(`Started: ${formatChecksheetTimestamp(unit.startedAt)} | Submitted: ${formatChecksheetTimestamp(unit.submittedAt)} | Duration: ${formatDuration(unit.timeToCompleteSeconds) || "Not recorded"}`, headerX, PAGE_MARGIN + 65);
  if (unit.comments) doc.font("Helvetica").fontSize(6).fillColor("black").text(`Comments: ${unit.comments}`, headerX, PAGE_MARGIN + 74, { width: contentWidth * 0.62 });
  drawImageIfPresent(doc, CITY_SEAL_PATH, pageWidth - PAGE_MARGIN - 26, PAGE_MARGIN + 26, { width: 24, height: 24 });
  doc.font("Helvetica-Bold").fontSize(7).fillColor("black").text(`Generated ${new Date(document.generatedAt).toLocaleString()}`, pageWidth - PAGE_MARGIN - 150, PAGE_MARGIN, { width: 150, align: "right" });
  doc.font("Helvetica-Bold").fontSize(9).text(`${unit.completedCompartments}/${unit.totalCompartments}`, pageWidth - PAGE_MARGIN - 150, PAGE_MARGIN + 12, { width: 150, align: "right" });

  doc.strokeColor("#0f172a").lineWidth(1).moveTo(PAGE_MARGIN, PAGE_MARGIN + 86).lineTo(pageWidth - PAGE_MARGIN, PAGE_MARGIN + 86).stroke();

  const columnY = [PAGE_MARGIN + 96, PAGE_MARGIN + 96, PAGE_MARGIN + 96];
  for (const compartment of unit.compartments) {
    let column = columnY.indexOf(Math.min(...columnY));
    if (columnY[column] > pageHeight - PAGE_MARGIN - 40) {
      doc.addPage();
      columnY[0] = PAGE_MARGIN;
      columnY[1] = PAGE_MARGIN;
      columnY[2] = PAGE_MARGIN;
      column = 0;
    }
    const x = PAGE_MARGIN + column * (columnWidth + COLUMN_GAP);
    columnY[column] = writeCompartment(doc, compartment, x, columnY[column], columnWidth);
  }
}

export async function generateDailyChecksheetsPdf(date: string) {
  const document = await getDailyChecksheetDocument(date);
  const pdf = new PDFDocument({ size: "LETTER", margin: PAGE_MARGIN });
  const bufferPromise = collectPdfBuffer(pdf);

  document.units.forEach((unit, index) => renderUnitPage(pdf, document, unit, index === 0));
  pdf.end();

  return {
    filename: `daily-checksheets-${date}.pdf`,
    content: await bufferPromise,
  };
}
