import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server-admin";

function InvalidQrPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-md rounded-3xl border border-red-200 bg-red-50 p-6 text-red-950 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Invalid QR Code</p>
        <h1 className="mt-3 text-3xl font-black">Invalid or inactive QR code.</h1>
        <p className="mt-3 font-semibold">Please contact an officer or administrator.</p>
      </section>
    </main>
  );
}

export default async function QrResolvePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = createAdminClient();
  const { data: target, error } = await supabase
    .from("qr_targets")
    .select("unit_id, compartment_id, unit_kit_id")
    .eq("code", code)
    .eq("active", true)
    .maybeSingle();

  if (error || !target) {
    return <InvalidQrPage />;
  }

  if (target.compartment_id) {
    redirect(`/checkoff/${target.unit_id}/${target.compartment_id}`);
  }

  if (target.unit_kit_id) {
    redirect(`/checkoff/${target.unit_id}/kit/${target.unit_kit_id}`);
  }

  return <InvalidQrPage />;
}
