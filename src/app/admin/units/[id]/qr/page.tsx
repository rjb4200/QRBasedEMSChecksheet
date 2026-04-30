import QRCode from "qrcode";
import { QrCodeGrid } from "./print-button";
import { getAppOrigin } from "@/lib/app-url";
import { createAdminClient } from "@/lib/supabase/server-admin";

export default async function UnitQrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: unit } = await supabase
    .from("units")
    .select("id, name, unit_compartments(id, name, sort_order)")
    .eq("id", id)
    .single();
  const appUrl = await getAppOrigin();
  const codes = await Promise.all((unit?.unit_compartments ?? []).sort((a, b) => a.sort_order - b.sort_order).map(async (compartment) => {
    const url = `${appUrl}/checkoff/${unit?.id}/${compartment.id}`;
    return {
      ...compartment,
      url,
      dataUrl: await QRCode.toDataURL(url, { margin: 2, width: 320 }),
    };
  }));

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-slate-950 print:px-0 print:py-0">
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
