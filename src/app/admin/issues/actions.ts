"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { getCurrentAdminLogActor, logSystemEvent } from "@/lib/system-log";

function normalizeTags(tags: unknown): string[] | null {
  if (!Array.isArray(tags)) return null;
  const normalized = [...new Set(
    tags.map((t) => typeof t === "string" ? t.trim().toLowerCase() : "").filter(Boolean)
  )];
  return normalized.length > 0 ? normalized : null;
}

export async function createIssue(formData: FormData) {
  const parsed = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    unitId: z.string().uuid().optional().or(z.literal("")),
    tags: z.string().optional(),
  }).parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    unitId: formData.get("unitId") || undefined,
    tags: formData.get("tags") || undefined,
  });

  const tagsArray = parsed.tags
    ? parsed.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : null;

  const actor = await getCurrentAdminLogActor();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("issues")
    .insert({
      title: parsed.title.trim(),
      description: parsed.description?.trim() || null,
      unit_id: parsed.unitId && parsed.unitId !== "" ? parsed.unitId : null,
      status: "open",
      created_by: actor.actorName,
      tags: normalizeTags(tagsArray),
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await logSystemEvent({
    ...actor,
    actorType: "admin",
    area: "issues",
    action: "issue.created",
    targetType: "issue",
    targetId: data.id,
    targetName: parsed.title.trim(),
    afterData: { title: parsed.title.trim(), unit_id: parsed.unitId || null },
  });

  redirect(`/admin/issues/${data.id}`);
}

export async function updateIssue(formData: FormData) {
  const parsed = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string(),
    status: z.enum(["open", "in_progress", "closed"]),
    unitId: z.string().uuid().optional().or(z.literal("")),
    tags: z.string(),
  }).parse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") || "",
    status: formData.get("status"),
    unitId: formData.get("unitId") || undefined,
    tags: formData.get("tags") || "",
  });

  const tagsArray = parsed.tags
    ? parsed.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  updates.title = parsed.title.trim();
  updates.description = parsed.description.trim() || null;
  updates.status = parsed.status;
  updates.unit_id = parsed.unitId && parsed.unitId !== "" ? parsed.unitId : null;
  updates.tags = normalizeTags(tagsArray);

  const supabase = createAdminClient();
  const { data: before } = await supabase
    .from("issues").select("title, status").eq("id", parsed.id).maybeSingle();

  const { error } = await supabase
    .from("issues").update(updates).eq("id", parsed.id);
  if (error) throw new Error(error.message);

  const actor = await getCurrentAdminLogActor();
  await logSystemEvent({
    ...actor,
    actorType: "admin",
    area: "issues",
    action: "issue.updated",
    targetType: "issue",
    targetId: parsed.id,
    targetName: before?.title ?? null,
    beforeData: before ?? null,
    afterData: updates,
  });

  revalidatePath(`/admin/issues/${parsed.id}`);
}

export async function deleteIssue(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));

  const supabase = createAdminClient();
  const { data: before } = await supabase
    .from("issues").select("title").eq("id", id).maybeSingle();

  const { error } = await supabase.from("issues").delete().eq("id", id);
  if (error) throw new Error(error.message);

  const actor = await getCurrentAdminLogActor();
  await logSystemEvent({
    ...actor,
    actorType: "admin",
    area: "issues",
    action: "issue.deleted",
    targetType: "issue",
    targetId: id,
    targetName: before?.title ?? null,
    beforeData: before ?? null,
  });

  revalidatePath("/admin/issues");
  redirect("/admin/issues");
}

export async function addIssueNote(formData: FormData) {
  const parsed = z.object({
    issueId: z.string().uuid(),
    text: z.string().min(1),
  }).parse({
    issueId: formData.get("issueId"),
    text: formData.get("text"),
  });

  const actor = await getCurrentAdminLogActor();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("issue_notes")
    .insert({
      issue_id: parsed.issueId,
      text: parsed.text.trim(),
      created_by: actor.actorName,
    });
  if (error) throw new Error(error.message);

  await logSystemEvent({
    ...actor,
    actorType: "admin",
    area: "issues",
    action: "issue.note_added",
    targetType: "issue",
    targetId: parsed.issueId,
  });

  revalidatePath(`/admin/issues/${parsed.issueId}`);
}
