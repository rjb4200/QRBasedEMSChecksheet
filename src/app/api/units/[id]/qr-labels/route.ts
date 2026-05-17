import { existsSync } from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { type NextRequest, NextResponse } from "next/server";
import { getRequestOrigin } from "@/lib/app-url";
import { getOrCreateQrTarget } from "@/lib/qr-targets";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export const runtime = "nodejs";

const INCH = 72;
const LABEL_WIDTH = 3 * INCH;
const LABEL_HEIGHT = 2 * INCH;
const CONTENT_WIDTH = 2 * INCH;
const CONTENT_HEIGHT = 3 * INCH;
const LABELS_PER_SHEET = 10;
const COLUMN_GAP = 0.1875 * INCH;
const SHEET_MARGIN = 0.5 * INCH;

type LabelTarget = {
  id: string;
  name: string;
  sort_order: number;
  type: "compartment" | "kit";
};

type LabelCode = {
  code: string;
  name: string;
  qrBuffer: Buffer;
};

function verifyFontAccess() {
  const fontFile = "Helvetica.afm";
  const candidates = [
    path.join(process.cwd(), "node_modules", "pdfkit", "js", "data", fontFile),
    path.join(process.cwd(), ".next", "server", "vendor-chunks", "pdfkit", "js", "data", fontFile),
  ];

  if (!candidates.some((candidate) => existsSync(candidate))) {
    console.warn("pdfkit fonts not found via process.cwd() - relying on serverExternalPackages resolution");
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

function getLabelPosition(index: number) {
  const row = Math.floor(index / 2);
  const column = index % 2;

  return {
    x: SHEET_MARGIN + column * (LABEL_WIDTH + COLUMN_GAP),
    y: SHEET_MARGIN + row * LABEL_HEIGHT,
  };
}

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function sanitizeFilename(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unit";
}

function drawRotatedLabel(pdf: PDFKit.PDFDocument, label: LabelCode, unitName: string, x: number, y: number) {
  const centerX = x + LABEL_WIDTH / 2;
  const centerY = y + LABEL_HEIGHT / 2;
  const contentX = centerX - CONTENT_WIDTH / 2;
  const contentY = centerY - CONTENT_HEIGHT / 2;
  const qrSize = 2 * INCH;
  const textY = contentY + qrSize + 6;

  pdf.save();
  pdf.rotate(90, { origin: [centerX, centerY] });

  pdf.image(label.qrBuffer, contentX, contentY, { width: qrSize, height: qrSize });
  pdf.font("Helvetica-Bold").fontSize(9).fillColor("black").text(truncateText(label.name, 34), contentX, textY, { width: CONTENT_WIDTH, align: "center", lineBreak: false });
  pdf.font("Helvetica").fontSize(6).fillColor("black").text(truncateText(unitName, 44), contentX, textY + 11, { width: CONTENT_WIDTH, align: "center", lineBreak: false });
  pdf.font("Courier").fontSize(5).fillColor("black").text(`/q/${label.code}`, contentX, textY + 19, { width: CONTENT_WIDTH, align: "center", lineBreak: false });

  pdf.restore();
}

async function generateLabelsPdf(unitName: string, labels: LabelCode[]) {
  verifyFontAccess();

  const pdf = new PDFDocument({ size: "LETTER", margin: 0, autoFirstPage: true });
  const bufferPromise = collectPdfBuffer(pdf);

  if (labels.length === 0) {
    pdf.font("Helvetica-Bold").fontSize(18).fillColor("black").text("No QR labels available", SHEET_MARGIN, SHEET_MARGIN);
  }

  labels.forEach((label, index) => {
    if (index > 0 && index % LABELS_PER_SHEET === 0) {
      pdf.addPage({ size: "LETTER", margin: 0 });
    }

    const position = getLabelPosition(index % LABELS_PER_SHEET);
    drawRotatedLabel(pdf, label, unitName, position.x, position.y);
  });

  pdf.end();

  return await bufferPromise;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: unit, error } = await supabase
    .from("units")
    .select("id, name, unit_compartments(id, name, sort_order), unit_kits(id, sort_order, kits(name))")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !unit) {
    return NextResponse.json({ error: error?.message ?? "Unit not found" }, { status: 404 });
  }

  const origin = getRequestOrigin(request);
  const adminSupabase = createAdminClient();
  const targets: LabelTarget[] = [
    ...(unit.unit_compartments ?? []).map((compartment: any) => ({
      id: compartment.id,
      name: compartment.name,
      sort_order: compartment.sort_order ?? 0,
      type: "compartment" as const,
    })),
    ...(unit.unit_kits ?? []).map((assignment: any) => {
      const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
      return {
        id: assignment.id,
        name: `${kit?.name ?? "Shared Kit"} (Kit)`,
        sort_order: assignment.sort_order ?? 0,
        type: "kit" as const,
      };
    }),
  ].sort((a, b) => a.sort_order - b.sort_order);

  const labels = await Promise.all(targets.map(async (target) => {
    const qrTarget = await getOrCreateQrTarget(adminSupabase, target.type === "compartment" ? { unitId: unit.id, compartmentId: target.id } : { unitId: unit.id, unitKitId: target.id });
    const url = `${origin}/q/${qrTarget.code}`;

    return {
      code: qrTarget.code,
      name: target.name,
      qrBuffer: await QRCode.toBuffer(url, { margin: 2, width: 288 }),
    };
  }));

  const pdf = await generateLabelsPdf(unit.name, labels);
  const filename = `${sanitizeFilename(unit.name)}-3x2-qr-labels.pdf`;

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
