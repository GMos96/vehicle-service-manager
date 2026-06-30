import { describe, it, expect } from "vitest";
import { formatDate } from "./date-util";

describe("formatDate", () => {
  it("returns empty string when date is undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("formats a date with the default MMMM DD, YYYY format", () => {
    const date = new Date("2024-03-15T12:00:00");
    expect(formatDate(date)).toBe("March 15, 2024");
  });

  it("formats a date with a custom format string", () => {
    const date = new Date("2024-03-15T12:00:00");
    expect(formatDate(date, "MM/DD/YYYY")).toBe("03/15/2024");
  });

  it("formats a date with a short month/year format", () => {
    const date = new Date("2024-01-01T12:00:00");
    expect(formatDate(date, "MMM YYYY")).toBe("Jan 2024");
  });
});
