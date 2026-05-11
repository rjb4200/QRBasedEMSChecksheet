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
      <style>{`@page { size: letter; margin: 0.5in 0.25in 0.25in 0.25in; }`}</style>
      <section className="mx-auto max-w-6xl space-y-6 print:max-w-none">
        <div className="flex items-end justify-between gap-4 print:hidden">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">QR Codes</p>
            <h1 className="mt-2 text-4xl font-black">{unit?.name}</h1>
            <p className="mt-2 text-slate-600">Print these labels and place each QR code on the matching physical compartment.</p>
          </div>
        </div>

        <QrCodeGrid codes={codes} unitName={unit?.name ?? "Unit"} />
      </section>
    </main>
  );
}
