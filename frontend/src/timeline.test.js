import { describe, expect, it, vi } from "vitest";
import { getPeriods } from "./timeline.js";

describe("Yrkesskade timeline", () => {
  it.each([
    new Date(2026, 10, 17, 15, 16),
    new Date(2027, 0, 1, 8),
  ])("shows the orange phase through the current day: %s", (today) => {
    vi.useFakeTimers();
    vi.setSystemTime(today);

    try {
      const periods = getPeriods("Yrkesskade");

      expect(periods).toHaveLength(3);
      expect(periods[0]).toMatchObject({
        color: "rosa",
        startDate: new Date(2011, 0, 1),
        endDate: new Date(2021, 11, 31),
      });
      expect(periods[1]).toMatchObject({
        color: "lilla",
        startDate: new Date(2022, 0, 1),
        endDate: new Date(2023, 5, 30),
      });
      expect(periods[2]).toMatchObject({
        color: "oransje",
        startDate: new Date(2023, 6, 1),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999),
      });
    } finally {
      vi.useRealTimers();
    }
  });
});
