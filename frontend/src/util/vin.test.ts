import { describe, it, expect } from "vitest";
import { isValidVinFormat } from "./vin";

describe("isValidVinFormat", () => {
  it("accepts a well-formed 17-character VIN", () => {
    expect(isValidVinFormat("1HGCM82633A004352")).toBe(true);
  });

  it("rejects VINs with disallowed characters I, O, or Q", () => {
    expect(isValidVinFormat("1HGCM8263IA004352")).toBe(false);
    expect(isValidVinFormat("1HGCM8263OA004352")).toBe(false);
    expect(isValidVinFormat("1HGCM8263QA004352")).toBe(false);
  });

  it("rejects VINs of the wrong length", () => {
    expect(isValidVinFormat("SHORTVIN")).toBe(false);
    expect(isValidVinFormat("1HGCM82633A0043521")).toBe(false);
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(isValidVinFormat("  1hgcm82633a004352  ")).toBe(true);
  });
});
