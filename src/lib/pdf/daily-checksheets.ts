import PDFDocument from "pdfkit";
import { existsSync } from "node:fs";
import path from "node:path";
import { formatDuration } from "@/lib/archive-records";
import { formatChecksheetTimestamp, formatChecksheetValue, getDailyChecksheetDocument, type DailyChecksheetDocument } from "@/lib/checksheet-documents";

const PAGE_MARGIN = 18;
const COLUMN_GAP = 12;
const COLUMN_COUNT = 3;
const WFD_LOGO_PATH = path.join(process.cwd(), "public", "images", "WFD_Logo_1848.jpg");
const CITY_SEAL_PATH = path.join(process.cwd(), "public", "images", "City of winchester Seal.png");

type PdfUnit = DailyChecksheetDocument["units"][number];
type PdfCompartment = PdfUnit["compartments"][number];

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

function writeCompartment(doc: PDFKit.PDFDocument, compartment: PdfCompartment, x: number, y: number, width: number) {
  let currentY = y;

  doc.font("Helvetica-Bold").fontSize(7).fillColor("black").text(compartment.name, x, currentY, { width: width * 0.7, lineBreak: false });
  doc
    .roundedRect(x + width * 0.72, currentY - 1, width * 0.28, 8, 3)
    .fillAndStroke("#e2e8f0", "#cbd5e1");
  doc
    .font("Helvetica-Bold")
    .fontSize(5)
    .fillColor("black")
    .text(compartment.checkStatus.replace("_", " ").toUpperCase(), x + width * 0.73, currentY, { width: width * 0.26, align: "center" });
  currentY += 10;

  if (compartment.items.length === 0) {
    doc.font("Helvetica").fontSize(5.5).fillColor("#64748b").text("No configured items.", x, currentY, { width });
    return currentY + 9;
  }

  for (const item of compartment.items) {
    const lineHeight = 7.3;
    const isException = item.status !== "ok";

    if (isException) {
      doc.rect(x - 1, currentY - 1, width + 2, lineHeight).strokeColor("#b91c1c").lineWidth(0.35).stroke();
    }

    doc.font(isException ? "Helvetica-Bold" : "Helvetica").fontSize(5.6).fillColor(isException ? "#b91c1c" : "black");
    doc.text(item.name, x, currentY, { width: width * 0.58, lineBreak: false });
    doc.text(formatChecksheetValue(item.actual), x + width * 0.6, currentY, { width: width * 0.18, lineBreak: false });
    doc.text(item.expected === null ? "" : `Par ${formatChecksheetValue(item.expected)}`, x + width * 0.78, currentY, { width: width * 0.22, lineBreak: false });
    currentY += lineHeight;
  }

  return currentY + 5;
}

function writeChecksheetFrame(doc: PDFKit.PDFDocument, x: number, y: number, width: number, height: number) {
  doc.roundedRect(x, y, width, height, 5).strokeColor("#334155").lineWidth(0.8).stroke();
}

function renderUnitPage(doc: PDFKit.PDFDocument, document: DailyChecksheetDocument, unit: PdfUnit, isFirstPage: boolean) {
  if (!isFirstPage) doc.addPage();

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  const columnWidth = (contentWidth - COLUMN_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

  drawImageIfPresent(doc, WFD_LOGO_PATH, PAGE_MARGIN, PAGE_MARGIN, { width: 40, height: 40 });
  const headerX = PAGE_MARGIN + 48;
  doc.font("Helvetica-Bold").fontSize(7).fillColor("#b91c1c").text("WINCHESTER FIRE DEPARTMENT", headerX, PAGE_MARGIN + 1);
  doc.font("Helvetica-Bold").fontSize(15).fillColor("black").text("EMS Equipment Check Sheet", headerX, PAGE_MARGIN + 10);
  doc.font("Helvetica-Bold").fontSize(9).fillColor("black").text(`${unit.name} | ${document.date} | ${unit.shiftName}`, headerX, PAGE_MARGIN + 28);
  doc.font("Helvetica-Bold").fontSize(6).fillColor("#475569").text(`${unit.status.replace("_", " ")} | ${unit.archiveStatus.replace("_", " ")}`.toUpperCase(), headerX, PAGE_MARGIN + 40);

  let detailY = PAGE_MARGIN + 49;
  if (unit.providerNames) {
    doc.font("Helvetica-Bold").fontSize(6).fillColor("black").text(`Crew: ${unit.providerNames}`, headerX, detailY, { width: contentWidth * 0.66 });
    detailY += 8;
  }
  doc.font("Helvetica-Bold").fontSize(6).fillColor("black").text(`Checked By: ${unit.checkedByName || "Not recorded"}`, headerX, detailY, { width: contentWidth * 0.66 });
  detailY += 8;
  doc.font("Helvetica-Bold").fontSize(6).fillColor("black").text(`Started: ${formatChecksheetTimestamp(unit.startedAt)} | Submitted: ${formatChecksheetTimestamp(unit.submittedAt)} | Duration: ${formatDuration(unit.timeToCompleteSeconds) || "Not recorded"}`, headerX, detailY, { width: contentWidth * 0.74 });
  detailY += 8;
  if (unit.comments) {
    doc.font("Helvetica-Bold").fontSize(6).fillColor("black").text(`Comments: ${unit.comments}`, headerX, detailY, { width: contentWidth * 0.7 });
  }

  drawImageIfPresent(doc, CITY_SEAL_PATH, pageWidth - PAGE_MARGIN - 32, PAGE_MARGIN + 22, { width: 32, height: 32 });
  doc.font("Helvetica-Bold").fontSize(7).fillColor("black").text(`Generated ${new Date(document.generatedAt).toLocaleString()}`, pageWidth - PAGE_MARGIN - 160, PAGE_MARGIN, { width: 160, align: "right" });
  doc.font("Helvetica-Bold").fontSize(9).text(`${unit.completedCompartments}/${unit.totalCompartments}`, pageWidth - PAGE_MARGIN - 160, PAGE_MARGIN + 12, { width: 160, align: "right" });

  const frameTop = PAGE_MARGIN + 88;
  const frameHeight = pageHeight - frameTop - PAGE_MARGIN;
  writeChecksheetFrame(doc, PAGE_MARGIN, frameTop, contentWidth, frameHeight);

  const columnY = [frameTop + 8, frameTop + 8, frameTop + 8];
  for (const compartment of unit.compartments) {
    let column = columnY.indexOf(Math.min(...columnY));

    if (columnY[column] > pageHeight - PAGE_MARGIN - 28) {
      doc.addPage();
      writeChecksheetFrame(doc, PAGE_MARGIN, PAGE_MARGIN, contentWidth, pageHeight - PAGE_MARGIN * 2);
      columnY[0] = PAGE_MARGIN + 8;
      columnY[1] = PAGE_MARGIN + 8;
      columnY[2] = PAGE_MARGIN + 8;
      column = 0;
    }

    const x = PAGE_MARGIN + 8 + column * (columnWidth + COLUMN_GAP);
    columnY[column] = writeCompartment(doc, compartment, x, columnY[column], columnWidth - 6);
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
