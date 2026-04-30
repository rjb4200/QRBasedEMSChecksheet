import QRCode from "qrcode";
import { NextResponse, type NextRequest } from "next/server";
import { getRequestOrigin } from "@/lib/app-url";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: unit, error } = await supabase
    .from("units")
    .select("id, name, unit_compartments(id, name)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const origin = getRequestOrigin(request);
  const codes = await Promise.all((unit.unit_compartments ?? []).map(async (compartment) => {
    const url = `${origin}/checkoff/${unit.id}/${compartment.id}`;
    return {
      unitId: unit.id,
      unitName: unit.name,
      compartmentId: compartment.id,
      compartmentName: compartment.name,
      url,
      dataUrl: await QRCode.toDataURL(url, { margin: 2, width: 320 }),
    };
  }));

  return NextResponse.json({ unit: { id: unit.id, name: unit.name }, codes });
}
