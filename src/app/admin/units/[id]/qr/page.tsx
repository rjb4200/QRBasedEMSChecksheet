import QRCode from "qrcode";
import { QrCodeGrid } from "./print-button";
import { getAppOrigin } from "@/lib/app-url";
import { getOrCreateQrTarget } from "@/lib/qr-targets";
import { createAdminClient } from "@/lib/supabase/server-admin";

export default async function UnitQrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      <style>{`@page { size: letter; margin: 0.75in 0.25in 0.25in 0.25in; }`}</style>
      <section className="mx-auto max-w-6xl space-y-6 print:max-w-none print:pl-[0.25in]">
        <div className="flex items-end justify-between gap-4 print:hidden">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">QR Codes</p>
            <h1 className="mt-2 text-4xl font-black">{unit?.name}</h1>
            <p className="mt-2 text-slate-600">Print these labels and place each QR code on the matching physical compartment.</p>
          </div>
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

        <QrCodeGrid codes={codes} unitName={unit?.name ?? "Unit"} />
      </section>
    </main>
  );
}
