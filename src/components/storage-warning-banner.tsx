import { getDatabaseUsage } from "@/lib/database-usage";

export async function StorageWarningBanner() {
  const { percentage, sizeMB, limitMB } = await getDatabaseUsage();

  if (percentage < 90) return null;

  const isCritical = percentage >= 95;

  return (
    <div className={`rounded-3xl p-5 shadow-sm ${isCritical ? "border-2 border-red-300 bg-red-50 text-red-950" : "border border-amber-200 bg-amber-50 text-amber-950"}`}>
      <p className="text-sm font-bold uppercase tracking-[0.25em]">{isCritical ? "Critical Storage Warning" : "Storage Warning"}</p>
      <p className="mt-2 font-semibold">
        Database storage is at {percentage}% ({sizeMB} MB of {limitMB} MB).
      </p>
      <p className="mt-1 text-sm">
        {isCritical
          ? "The database is near its capacity limit. Records and checkoffs may be affected soon."
          : "Consider reviewing and clearing old records to free space."}
      </p>
    </div>
  );
}
