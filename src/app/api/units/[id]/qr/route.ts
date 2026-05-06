import QRCode from "qrcode";
import { NextResponse, type NextRequest } from "next/server";
import { getRequestOrigin } from "@/lib/app-url";
import { getOrCreateQrTarget } from "@/lib/qr-targets";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: unit, error } = await supabase
    .from("units")
    .select("id, name, unit_compartments(id, name), unit_kits(id, kits(name))")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const origin = getRequestOrigin(request);
  const adminSupabase = createAdminClient();
  const targets = [
    ...(unit.unit_compartments ?? []).map((compartment: any) => ({ id: compartment.id, name: compartment.name, type: "compartment" as const })),
    ...(unit.unit_kits ?? []).map((assignment: any) => {
      const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
      return { id: assignment.id, name: kit?.name ?? "Shared Kit", type: "kit" as const };
    }),
  ];
  const codes = await Promise.all(targets.map(async (target) => {
    const qrTarget = await getOrCreateQrTarget(adminSupabase, target.type === "compartment" ? { unitId: unit.id, compartmentId: target.id } : { unitId: unit.id, unitKitId: target.id });
    const url = `${origin}/q/${qrTarget.code}`;
    return {
      unitId: unit.id,
      unitName: unit.name,
      code: qrTarget.code,
      compartmentId: target.type === "compartment" ? target.id : null,
      compartmentName: target.type === "compartment" ? target.name : null,
      unitKitId: target.type === "kit" ? target.id : null,
      kitName: target.type === "kit" ? target.name : null,
      url,
      dataUrl: await QRCode.toDataURL(url, { margin: 2, width: 320 }),
    };
  }));

  return NextResponse.json({ unit: { id: unit.id, name: unit.name }, codes });
}
