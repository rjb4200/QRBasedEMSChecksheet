import { describe, expect, it } from "vitest";

function barColor(pct: number) {
  if (pct <= 0) return "bg-slate-200";
  if (pct > 85) return "bg-green-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-red-500";
}

function computePct(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

function computeBarHeight(pct: number, totalInService: number, maxHeight: number) {
  if (totalInService <= 0) return 2;
  return Math.max(2, (pct / 100) * maxHeight);
}

describe("completion-trend-chart logic", () => {
  describe("computePct", () => {
    it("returns 100 when all units are checked", () => {
      expect(computePct(8, 8)).toBe(100);
    });

    it("returns 88 when 7 of 8 are checked", () => {
      expect(computePct(7, 8)).toBe(88);
    });

    it("returns 75 when 6 of 8 are checked", () => {
      expect(computePct(6, 8)).toBe(75);
    });

    it("returns 0 when no records exist", () => {
      expect(computePct(0, 8)).toBe(0);
    });

    it("returns 0 when total is zero (division by zero guard)", () => {
      expect(computePct(0, 0)).toBe(0);
    });
  });

  describe("barColor", () => {
    it("returns green for >85%", () => {
      expect(barColor(86)).toBe("bg-green-500");
      expect(barColor(100)).toBe("bg-green-500");
    });

    it("returns amber for 70-85%", () => {
      expect(barColor(70)).toBe("bg-amber-500");
      expect(barColor(85)).toBe("bg-amber-500");
    });

    it("returns red for <70%", () => {
      expect(barColor(69)).toBe("bg-red-500");
      expect(barColor(1)).toBe("bg-red-500");
    });

    it("returns gray for 0 or negative", () => {
      expect(barColor(0)).toBe("bg-slate-200");
    });
  });

  describe("computeBarHeight", () => {
    it("returns proportional height for >0 in-service units", () => {
      expect(computeBarHeight(100, 8, 128)).toBe(128);
      expect(computeBarHeight(50, 8, 128)).toBe(64);
    });

    it("returns minimum height of 2 for zero in-service units", () => {
      expect(computeBarHeight(0, 0, 128)).toBe(2);
    });

    it("returns at least 2 for very low percentages", () => {
      expect(computeBarHeight(1, 8, 128)).toBe(2);
    });
  });
});
