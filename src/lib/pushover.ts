interface PushoverResponse {
  status: number;
  request: string;
  errors?: string[];
}

function quietHourCheck(): boolean {
  const hour = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    hourCycle: "h23",
    timeZone: "America/New_York",
  }).format(new Date());
  const h = Number(hour);
  return h >= 8 && h < 22;
}

function isWithinQuietHours(): boolean {
  return !quietHourCheck();
}

export type PushoverAlertType = "daily_report" | "missed_checkoff" | "missed_checkoff_fup" | "test";

export async function sendPushoverNotification({
  userKey,
  title,
  message,
  priority = 0,
  bypassQuietHours = false,
}: {
  userKey: string;
  title: string;
  message: string;
  priority?: number;
  bypassQuietHours?: boolean;
}): Promise<{ success: boolean; requestId?: string; error?: string }> {
  if (!bypassQuietHours && isWithinQuietHours()) {
    return { success: false, error: "Outside quiet hours (0800-2200 ET)" };
  }

  const appToken = process.env.PUSHOVER_APP_TOKEN;
  if (!appToken) {
    return { success: false, error: "PUSHOVER_APP_TOKEN is not configured" };
  }

  try {
    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: appToken,
        user: userKey,
        title,
        message,
        priority,
      }),
    });

    const result: PushoverResponse = await response.json();

    if (response.status !== 200 || !result.status || result.status !== 1) {
      return {
        success: false,
        error: result.errors?.join(", ") ?? `Pushover API returned status ${result.status}`,
      };
    }

    return { success: true, requestId: result.request };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Pushover request failed" };
  }
}
