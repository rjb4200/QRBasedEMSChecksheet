import QRCode from "qrcode";
import { PrintButton } from "./print-button";
import { createClient } from "@/lib/supabase/server";

export default async function UnitQrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: unit } = await supabase
    .from("units")
    .select("id, name, unit_compartments(id, name, sort_order)")
    .eq("id", id)
    .single();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
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
          <PrintButton />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-3">
          {codes.map((code) => (
            <article key={code.id} className="break-inside-avoid rounded-3xl border border-slate-300 p-5 text-center print:rounded-xl print:p-3">
              <img alt={`${unit?.name} ${code.name} QR code`} className="mx-auto h-56 w-56 print:h-40 print:w-40" src={code.dataUrl} />
              <h2 className="mt-4 text-xl font-black print:text-base">{unit?.name}</h2>
              <p className="font-semibold text-slate-700 print:text-sm">{code.name}</p>
              <p className="mt-2 break-all text-xs text-slate-500 print:hidden">{code.url}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
