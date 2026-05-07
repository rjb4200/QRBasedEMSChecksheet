import PDFDocument from "pdfkit";
import { formatChecksheetValue, getDailyChecksheetDocument, type DailyChecksheetDocument } from "@/lib/checksheet-documents";

const PAGE_MARGIN = 24;
const COLUMN_GAP = 10;
const COLUMN_COUNT = 3;

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

  doc.font("Helvetica-Bold").fontSize(7).fillColor("#b91c1c").text("EMS DAILY CHECK SHEETS", PAGE_MARGIN, PAGE_MARGIN);
  doc.font("Helvetica-Bold").fontSize(15).fillColor("black").text(`${unit.name} | ${document.date}`, PAGE_MARGIN, PAGE_MARGIN + 9);
  doc.font("Helvetica").fontSize(6).fillColor("#475569").text(`${unit.status.replace("_", " ")} | ${unit.archiveStatus.replace("_", " ")}`, PAGE_MARGIN, PAGE_MARGIN + 27);
  if (unit.providerNames) doc.font("Helvetica-Bold").fontSize(6).fillColor("black").text(`Crew: ${unit.providerNames}`, PAGE_MARGIN, PAGE_MARGIN + 36);
  doc.font("Helvetica-Bold").fontSize(7).fillColor("black").text(`Generated ${new Date(document.generatedAt).toLocaleString()}`, pageWidth - PAGE_MARGIN - 150, PAGE_MARGIN, { width: 150, align: "right" });
  doc.font("Helvetica-Bold").fontSize(9).text(`${unit.completedCompartments}/${unit.totalCompartments}`, pageWidth - PAGE_MARGIN - 150, PAGE_MARGIN + 12, { width: 150, align: "right" });

  doc.strokeColor("#0f172a").lineWidth(1).moveTo(PAGE_MARGIN, PAGE_MARGIN + 48).lineTo(pageWidth - PAGE_MARGIN, PAGE_MARGIN + 48).stroke();

  const columnY = [PAGE_MARGIN + 58, PAGE_MARGIN + 58, PAGE_MARGIN + 58];
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
