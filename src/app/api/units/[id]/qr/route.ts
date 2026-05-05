import QRCode from "qrcode";
import { NextResponse, type NextRequest } from "next/server";
import { getRequestOrigin } from "@/lib/app-url";
import { createClient } from "@/lib/supabase/server";

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
  const targets = [
    ...(unit.unit_compartments ?? []).map((compartment: any) => ({ id: compartment.id, name: compartment.name, type: "compartment", url: `${origin}/checkoff/${unit.id}/${compartment.id}` })),
    ...(unit.unit_kits ?? []).map((assignment: any) => {
      const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
      return { id: assignment.id, name: kit?.name ?? "Shared Kit", type: "kit", url: `${origin}/checkoff/${unit.id}/kit/${assignment.id}` };
    }),
  ];
  const codes = await Promise.all(targets.map(async (target) => {
    const url = target.url;
    return {
      unitId: unit.id,
      unitName: unit.name,
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
