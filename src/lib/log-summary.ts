type LogRow = {
  action: string;
  actor_name: string | null;
  actor_type: string;
  target_name: string | null;
  target_type: string | null;
  result?: string;
  message: string | null;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

export function formatLogSummary(row: LogRow): string {
  const actor = row.actor_name ?? row.actor_type;
  const target = row.target_name ?? row.target_type ?? "unknown";

  if (row.action.startsWith("unit.status_changed")) {
    const beforeStatus = typeof row.before_data?.status === "string" ? row.before_data.status.replaceAll("_", " ") : null;
    const afterStatus = typeof row.after_data?.status === "string" ? row.after_data.status.replaceAll("_", " ") : null;
    if (beforeStatus && afterStatus) {
      return `${actor} changed ${target} from ${beforeStatus} to ${afterStatus}`;
    }
  }

  if (row.action.startsWith("unit.created")) {
    return `${actor} created ${target}`;
  }

  if (row.action.startsWith("unit.archived")) {
    return `${actor} archived ${target}`;
  }

  if (row.action.startsWith("crew.locked")) {
    return `${actor} locked crew for ${target}`;
  }

  if (row.action.startsWith("daily_report")) {
    const count = typeof row.metadata?.recipient_count === "number" ? row.metadata.recipient_count : null;
    if (row.result === "failure") {
      return row.message ? `Daily report failed: ${row.message}` : "Daily report failed";
    }
    return count ? `Daily report sent to ${count} recipients` : "Daily report sent";
  }

  if (row.action.startsWith("rotate_records")) {
    const md = row.metadata as Record<string, unknown> | null;
    const dateRange = md?.dateRange as { from?: string; to?: string } | undefined;
    const total = typeof md?.totalCleared === "number" ? md.totalCleared : 0;
    if (dateRange?.from && dateRange?.to) {
      return `${actor} rotated records ${dateRange.from} to ${dateRange.to}, ${total} rows cleared`;
    }
  }

  if (row.message) {
    return `${actor} ${row.action}: ${row.message}`;
  }

  return `${actor} ${row.action} on ${target}`;
}
