import { randomInt } from "node:crypto";
import { type SupabaseClient } from "@supabase/supabase-js";

const QR_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const QR_CODE_LENGTH = 5;
const MAX_QR_CODE_ATTEMPTS = 10;

type CompartmentQrTarget = {
  unitId: string;
  compartmentId: string;
  unitKitId?: never;
};

type UnitKitQrTarget = {
  unitId: string;
  compartmentId?: never;
  unitKitId: string;
};

export type QrTargetInput = CompartmentQrTarget | UnitKitQrTarget;

export type QrTarget = {
  id: string;
  code: string;
  unit_id: string;
  compartment_id: string | null;
  unit_kit_id: string | null;
};

export function generateQrCode(length = QR_CODE_LENGTH) {
  return Array.from({ length }, () => QR_CODE_ALPHABET[randomInt(QR_CODE_ALPHABET.length)]).join("");
}

function applyTargetFilter(query: any, target: QrTargetInput) {
  if (target.compartmentId) {
    return query.eq("compartment_id", target.compartmentId).is("unit_kit_id", null);
  }

  return query.eq("unit_kit_id", target.unitKitId).is("compartment_id", null);
}

export async function findActiveQrTarget(supabase: SupabaseClient, target: QrTargetInput) {
  const query = supabase
    .from("qr_targets")
    .select("id, code, unit_id, compartment_id, unit_kit_id")
    .eq("unit_id", target.unitId)
    .eq("active", true)
    .limit(1);

  const { data, error } = await applyTargetFilter(query, target).maybeSingle();
  if (error) throw new Error(error.message);

  return (data ?? null) as QrTarget | null;
}

export async function getOrCreateQrTarget(supabase: SupabaseClient, target: QrTargetInput) {
  const existing = await findActiveQrTarget(supabase, target);
  if (existing) return existing;

  for (let attempt = 0; attempt < MAX_QR_CODE_ATTEMPTS; attempt += 1) {
    const payload = {
      code: generateQrCode(),
      unit_id: target.unitId,
      compartment_id: target.compartmentId ?? null,
      unit_kit_id: target.unitKitId ?? null,
      active: true,
    };
    const { data, error } = await supabase
      .from("qr_targets")
      .insert(payload)
      .select("id, code, unit_id, compartment_id, unit_kit_id")
      .single();

    if (!error) return data as QrTarget;

    if (error.code !== "23505") {
      throw new Error(error.message);
    }

    const concurrentTarget = await findActiveQrTarget(supabase, target);
    if (concurrentTarget) return concurrentTarget;
  }

  throw new Error("Unable to create a unique QR code. Please try again.");
}
