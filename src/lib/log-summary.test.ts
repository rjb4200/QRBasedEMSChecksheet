import { describe, expect, it } from "vitest";
import { formatLogSummary } from "./log-summary";

describe("formatLogSummary", () => {
  const base = { actor_name: "admin1", actor_type: "admin", target_name: "EC1", target_type: "unit" };

  it("shows status change direction", () => {
    expect(formatLogSummary({
      ...base,
      action: "unit.status_changed",
      before_data: { status: "in_service" },
      after_data: { status: "out_of_service" },
      message: null,
      metadata: null,
    })).toBe("admin1 changed EC1 from in service to out of service");
  });

  it("shows unit created", () => {
    expect(formatLogSummary({
      ...base,
      action: "unit.created",
      before_data: null,
      after_data: null,
      message: null,
      metadata: null,
    })).toBe("admin1 created EC1");
  });

  it("shows unit archived", () => {
    expect(formatLogSummary({
      ...base,
      action: "unit.archived",
      before_data: null,
      after_data: { status: "out_of_service", archived: true },
      message: null,
      metadata: null,
    })).toBe("admin1 archived EC1");
  });

  it("shows crew locked", () => {
    expect(formatLogSummary({
      ...base,
      action: "crew.locked",
      before_data: null,
      after_data: null,
      message: null,
      metadata: null,
    })).toBe("admin1 locked crew for EC1");
  });

  it("shows daily report sent with count", () => {
    expect(formatLogSummary({
      ...base,
      action: "daily_report.sent",
      result: "success",
      before_data: null,
      after_data: null,
      message: null,
      metadata: { recipient_count: 3 },
    })).toBe("Daily report sent to 3 recipients");
  });

  it("shows daily report failed with message", () => {
    expect(formatLogSummary({
      ...base,
      action: "daily_report.failed",
      result: "failure",
      before_data: null,
      after_data: null,
      message: "Resend API returned 401",
      metadata: null,
    })).toBe("Daily report failed: Resend API returned 401");
  });

  it("shows rotate records", () => {
    expect(formatLogSummary({
      ...base,
      action: "rotate_records",
      result: "success",
      before_data: null,
      after_data: null,
      message: null,
      metadata: { dateRange: { from: "2026-05-01", to: "2026-05-15" }, totalCleared: 27 },
    })).toBe("admin1 rotated records 2026-05-01 to 2026-05-15, 27 rows cleared");
  });

  it("shows message when present and no specific handler matches", () => {
    expect(formatLogSummary({
      ...base,
      action: "equipment.deleted",
      before_data: null,
      after_data: null,
      message: "Item was in use",
      metadata: null,
    })).toBe("admin1 equipment.deleted: Item was in use");
  });

  it("falls back to generic actor action on target", () => {
    expect(formatLogSummary({
      ...base,
      action: "unknown.action",
      before_data: null,
      after_data: null,
      message: null,
      metadata: null,
    })).toBe("admin1 unknown.action on EC1");
  });

  it("uses actor_type when actor_name is null", () => {
    expect(formatLogSummary({
      ...base,
      actor_name: null,
      actor_type: "system",
      action: "daily_report.sent",
      result: "success",
      before_data: null,
      after_data: null,
      message: null,
      metadata: { recipient_count: 2 },
    })).toBe("Daily report sent to 2 recipients");
  });

  it("falls back gracefully when no status data is present", () => {
    expect(formatLogSummary({
      ...base,
      action: "unit.status_changed",
      before_data: null,
      after_data: { status: "out_of_service" },
      message: null,
      metadata: null,
    })).toBe("admin1 unit.status_changed on EC1");
  });
});
