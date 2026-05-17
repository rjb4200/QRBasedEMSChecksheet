import QRCode from "qrcode";
import { QrCodeGrid, RotatedLabelGrid } from "./print-button";
import { getAppOrigin } from "@/lib/app-url";
import { getOrCreateQrTarget } from "@/lib/qr-targets";
import { createAdminClient } from "@/lib/supabase/server-admin";

export default async function UnitQrPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ format?: string }> }) {
  const { id } = await params;
  const { format } = await searchParams;
  const isRotated = format === "3x2-rotated";
  const supabase = createAdminClient();
  const { data: unit } = await supabase
    .from("units")
    .select("id, name, unit_compartments(id, name, sort_order), unit_kits(id, sort_order, kits(name))")
      .eq("id", id)
      .is("deleted_at", null)
    .single();
  const appUrl = await getAppOrigin();
  const targets = [
    ...(unit?.unit_compartments ?? []).map((compartment: any) => ({ id: compartment.id, name: compartment.name, sort_order: compartment.sort_order ?? 0, type: "compartment" as const })),
    ...(unit?.unit_kits ?? []).map((assignment: any) => {
      const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
      return { id: assignment.id, name: `${kit?.name ?? "Shared Kit"} (Kit)`, sort_order: assignment.sort_order ?? 0, type: "kit" as const };
    }),
  ].sort((a, b) => a.sort_order - b.sort_order);
  const codes = await Promise.all(targets.map(async (target) => {
    const qrTarget = await getOrCreateQrTarget(supabase, target.type === "compartment" ? { unitId: id, compartmentId: target.id } : { unitId: id, unitKitId: target.id });
    const url = `${appUrl}/q/${qrTarget.code}`;
    return {
      id: target.id,
      code: qrTarget.code,
      name: target.name,
      url,
      dataUrl: await QRCode.toDataURL(url, { margin: 2, width: 320 }),
    };
  }));

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-slate-950 print:px-0 print:py-0">
      {isRotated ? (
        <style>{`
          @page { size: letter; margin: 0; }

          @media print {
            html,
            body {
              margin: 0;
              padding: 0;
              width: 8.5in;
            }

            main,
            section {
              margin: 0 !important;
              padding: 0 !important;
            }

            .qr-label-sheet {
              width: 8.5in;
              height: 10.94in;
              display: grid;
              grid-template-columns: repeat(2, 3in);
              grid-template-rows: repeat(5, 1.988in);
              column-gap: 0.1875in;
              row-gap: 0;
              box-sizing: border-box;
              padding: 0.5in 0.5in 0.5in 0.5in;
              margin: 0;
              break-after: page;
              page-break-after: always;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .qr-label-sheet:last-child {
              break-after: auto;
              page-break-after: auto;
            }

            .qr-label {
              width: 3in;
              height: 1.988in;
              position: relative;
              overflow: hidden;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .qr-label-rotated {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 1.92in;
              height: 2.88in;
              padding: 0.12in;
              display: grid;
              grid-template-rows: 1fr auto;
              align-items: center;
              justify-items: center;
              gap: 0.08in;
              transform: translate(-50%, -50%) rotate(90deg);
              transform-origin: center center;
            }
          }
        `}</style>
      ) : (
        <style>{`@page { size: letter; margin: 0.75in 0.25in 0.25in 0.25in; }`}</style>
      )}
      <section className={`mx-auto max-w-6xl space-y-6 print:max-w-none ${isRotated ? "print:space-y-0" : "print:pl-[0.25in]"}`}>
        <div className="flex items-end justify-between gap-4 print:hidden">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">QR Codes</p>
            <h1 className="mt-2 text-4xl font-black">{unit?.name}</h1>
            <p className="mt-2 text-slate-600">
              {isRotated
                ? "3×2 label layout with selectable labels and optional duplicate physical copies. Print at 100% scale with headers/footers off."
                : "Select the QR labels to print and optionally include duplicate physical copies for unit placement."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <a className={`rounded-2xl px-5 py-3 font-bold ${!isRotated ? "bg-red-700 text-white" : "border border-slate-300 text-slate-950"}`} href={`/admin/units/${id}/qr`}>
            Standard
          </a>
          <a className={`rounded-2xl px-5 py-3 font-bold ${isRotated ? "bg-red-700 text-white" : "border border-slate-300 text-slate-950"}`} href={`/admin/units/${id}/qr?format=3x2-rotated`}>
            3×2 Labels
          </a>
        </div>

        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 text-blue-950 print:hidden">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">NFC Tag Setup</p>
          <p className="mt-2 text-sm font-semibold">Use NFC tags for one-tap compartment access — no camera needed. Works with gloves and in low light.</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-blue-900">
            <li className="mt-1">Use <strong>NTAG216 anti-metal NFC tags</strong> (30mm+ diameter).</li>
            <li className="mt-1">Apply the tag under each QR label. Anti-metal tags are required for apparatus compartments.</li>
            <li className="mt-1">Use an NFC writer app (like NFC Tools) to program each tag with the URL shown below.</li>
            <li className="mt-1">Copy the URL using the <strong>Copy URL</strong> button next to each QR code, then paste into your NFC writer.</li>
            <li className="mt-1">Layering: anti-metal NFC tag → QR label → clear protective overlay.</li>
          </ul>
        </div>

        {isRotated ? (
          <RotatedLabelGrid codes={codes} unitName={unit?.name ?? "Unit"} />
        ) : (
          <QrCodeGrid codes={codes} unitName={unit?.name ?? "Unit"} />
        )}
      </section>
    </main>
  );
}
