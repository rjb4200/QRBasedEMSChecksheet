import { createAdminClient } from "@/lib/supabase/server-admin";

export async function getDatabaseUsage() {
  const limitMB = Number(process.env.DATABASE_STORAGE_LIMIT_MB) || 500;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.rpc("get_database_size");
    const sizeBytes = data ? Number(data) : 0;
    const sizeMB = Math.round(sizeBytes / (1024 * 1024));
    const percentage = limitMB > 0 ? Math.round((sizeMB / limitMB) * 10000) / 100 : 0;
    return { sizeMB, limitMB, percentage };
  } catch {
    return { sizeMB: 0, limitMB, percentage: 0 };
  }
}
