"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function createTemplate(formData: FormData) {
  const parsed = z.object({ name: z.string().min(1), description: z.string().optional() }).parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("templates").insert(parsed).select("id").single();

  if (error) throw new Error(error.message);
  redirect(`/admin/templates/${data.id}`);
}

export async function deleteTemplate(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createAdminClient();
  const { error } = await supabase.from("templates").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/templates");
}

export async function addTemplateCompartment(formData: FormData) {
  const parsed = z.object({ templateId: z.string().uuid(), name: z.string().min(1), sortOrder: z.coerce.number().default(0) }).parse({
    templateId: formData.get("templateId"),
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = await createAdminClient();
  const { error } = await supabase.from("template_compartments").upsert({
    template_id: parsed.templateId,
    name: parsed.name,
    sort_order: parsed.sortOrder,
  }, {
    onConflict: "template_id,name",
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/templates/${parsed.templateId}`);
}

export async function deleteTemplateCompartment(formData: FormData) {
  const parsed = z.object({ templateId: z.string().uuid(), id: z.string().uuid() }).parse({
    templateId: formData.get("templateId"),
    id: formData.get("id"),
  });
  const supabase = await createAdminClient();
  const { error } = await supabase.from("template_compartments").delete().eq("id", parsed.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/templates/${parsed.templateId}`);
}

export async function addTemplateItem(formData: FormData) {
  const parsed = z.object({
    templateId: z.string().uuid(),
    compartmentId: z.string().uuid(),
    equipmentId: z.string().uuid(),
    inputType: z.enum(["quantity", "checkbox", "condition"]),
    parLevel: z.coerce.number().nullable(),
  }).parse({
    templateId: formData.get("templateId"),
    compartmentId: formData.get("compartmentId"),
    equipmentId: formData.get("equipmentId"),
    inputType: formData.get("inputType"),
    parLevel: formData.get("parLevel") || null,
  });
  const supabase = await createAdminClient();
  const { error } = await supabase.from("template_compartment_items").upsert({
    compartment_id: parsed.compartmentId,
    equipment_id: parsed.equipmentId,
    input_type: parsed.inputType,
    par_level: parsed.parLevel,
  }, {
    onConflict: "compartment_id,equipment_id",
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/templates/${parsed.templateId}`);
}

export async function createTemplateFromUnit(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), name: z.string().min(1), description: z.string().optional() }).parse({
    unitId: formData.get("unitId"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  const supabase = await createAdminClient();
  const { data: template, error: templateError } = await supabase.from("templates").insert({
    name: parsed.name,
    description: parsed.description,
  }).select("id").single();
  if (templateError) throw new Error(templateError.message);

  const { data: compartments, error: compartmentsError } = await supabase
    .from("unit_compartments")
    .select("*, unit_compartment_items(*)")
    .eq("unit_id", parsed.unitId)
    .order("sort_order");
  if (compartmentsError) throw new Error(compartmentsError.message);

  for (const compartment of compartments ?? []) {
    const { data: newCompartment, error: compartmentError } = await supabase.from("template_compartments").insert({
      template_id: template.id,
      name: compartment.name,
      sort_order: compartment.sort_order,
      grid_position: compartment.grid_position,
      photo_url: compartment.photo_url,
    }).select("id").single();
    if (compartmentError) throw new Error(compartmentError.message);

    const items = (compartment.unit_compartment_items ?? []).map((item: any) => ({
      compartment_id: newCompartment.id,
      equipment_id: item.equipment_id,
      sort_order: item.sort_order,
      par_level: item.par_level,
      input_type: item.input_type,
    }));

    if (items.length > 0) {
      const { error: itemError } = await supabase.from("template_compartment_items").insert(items);
      if (itemError) throw new Error(itemError.message);
    }
  }

  redirect(`/admin/templates/${template.id}`);
}
